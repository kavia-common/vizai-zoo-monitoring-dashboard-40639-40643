import env, { log, isLogEnabled } from './env';

/**
 * Lightweight fetch wrapper. No real backend required; provides stub mode.
 * PUBLIC_INTERFACE
 */
export const api = {
  // PUBLIC_INTERFACE
  async get(path, { stub, headers } = {}) {
    const url = buildUrl(path);
    if (stub) {
      if (isLogEnabled('debug')) log('debug', 'API GET (stub):', path, stub);
      // Simulate a tiny delay
      await delay(50);
      return { ok: true, status: 200, data: clone(stub) };
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
    });
    const data = await safeJson(res);
    if (!res.ok) {
      log('warn', 'API GET error', { url, status: res.status, data });
    } else {
      if (isLogEnabled('debug')) log('debug', 'API GET', { url, data });
    }
    return { ok: res.ok, status: res.status, data };
  },

  // PUBLIC_INTERFACE
  async post(path, body, { stub, headers } = {}) {
    const url = buildUrl(path);
    if (stub) {
      if (isLogEnabled('debug')) log('debug', 'API POST (stub):', path, body, '->', stub);
      await delay(50);
      return { ok: true, status: 200, data: clone(stub) };
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: JSON.stringify(body || {}),
    });
    const data = await safeJson(res);
    if (!res.ok) {
      log('warn', 'API POST error', { url, status: res.status, data });
    } else {
      if (isLogEnabled('debug')) log('debug', 'API POST', { url, req: body, data });
    }
    return { ok: res.ok, status: res.status, data };
  },
};

function buildUrl(path) {
  const base = env.API_BASE || '';
  if (!path) return base;
  if (path.startsWith('http')) return path;
  if (base.endsWith('/') && path.startsWith('/')) return base + path.slice(1);
  if (!base && !path.startsWith('/')) return '/' + path;
  return base + (path.startsWith('/') ? '' : '/') + path;
}

async function safeJson(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const clone = (v) => JSON.parse(JSON.stringify(v));

export default api;
