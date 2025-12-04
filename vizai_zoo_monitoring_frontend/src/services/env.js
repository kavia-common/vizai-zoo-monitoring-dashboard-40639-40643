//
// PUBLIC_INTERFACE
// Exposes environment variables (REACT_APP_*) with safe defaults and helpers.
//
const raw = {
  API_BASE: process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '',
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || window.location.origin || '',
  WS_URL: process.env.REACT_APP_WS_URL || '',
  NODE_ENV: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development',
  NEXT_TELEMETRY_DISABLED: process.env.REACT_APP_NEXT_TELEMETRY_DISABLED || '1',
  ENABLE_SOURCE_MAPS: process.env.REACT_APP_ENABLE_SOURCE_MAPS || '1',
  PORT: process.env.REACT_APP_PORT || '3000',
  TRUST_PROXY: process.env.REACT_APP_TRUST_PROXY || '0',
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
  HEALTHCHECK_PATH: process.env.REACT_APP_HEALTHCHECK_PATH || '/healthz',
  FEATURE_FLAGS: process.env.REACT_APP_FEATURE_FLAGS || '',
  EXPERIMENTS_ENABLED: process.env.REACT_APP_EXPERIMENTS_ENABLED || '0',
};

// Normalize/derive values
const normalizeUrl = (u) => {
  if (!u) return '';
  try {
    // allow relative paths like /api
    if (u.startsWith('/')) return u;
    const url = new URL(u);
    return url.toString().replace(/\/+$/, '');
  } catch {
    return '';
  }
};

const parseFlags = (csv) =>
  (csv || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const levels = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];
const levelIndex = (lvl) => {
  const i = levels.indexOf(String(lvl || '').toLowerCase());
  return i >= 0 ? i : levels.indexOf('info');
};

// PUBLIC_INTERFACE
export const env = {
  /** Base URL for REST API calls (can be a full URL or relative path like /api) */
  API_BASE: normalizeUrl(raw.API_BASE) || '/api',
  /** Base URL this frontend is served from */
  FRONTEND_URL: normalizeUrl(raw.FRONTEND_URL) || window.location.origin,
  /** WebSocket URL (wss://… or ws://…). If empty, will be derived from API_BASE when possible. */
  WS_URL:
    raw.WS_URL ||
    (raw.API_BASE
      ? (raw.API_BASE.startsWith('https') ? raw.API_BASE.replace(/^https/, 'wss') : raw.API_BASE.replace(/^http/, 'ws'))
      : ''),
  /** Node environment string */
  NODE_ENV: raw.NODE_ENV,
  /** Logging level: silent|error|warn|info|debug|trace */
  LOG_LEVEL: levels[levelIndex(raw.LOG_LEVEL)],
  /** Feature flags as string array parsed from REACT_APP_FEATURE_FLAGS (comma separated) */
  FEATURE_FLAGS: parseFlags(raw.FEATURE_FLAGS),
  /** Experiments enabled (boolean) */
  EXPERIMENTS_ENABLED: ['1', 'true', 'yes', 'on'].includes(String(raw.EXPERIMENTS_ENABLED).toLowerCase()),
  /** Healthcheck path for readiness checks */
  HEALTHCHECK_PATH: raw.HEALTHCHECK_PATH,
};

// PUBLIC_INTERFACE
export function isLogEnabled(level) {
  return levelIndex(level) <= levelIndex(env.LOG_LEVEL);
}

// PUBLIC_INTERFACE
export function log(level, ...args) {
  if (!isLogEnabled(level)) return;
  const tag = `[VIZAI:${level.toUpperCase()}]`;
  // eslint-disable-next-line no-console
  (console[level] || console.log).apply(console, [tag, ...args]);
}

export default env;
