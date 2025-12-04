import env, { log, isLogEnabled } from './env';

/**
 * PUBLIC_INTERFACE
 * Minimal WebSocket manager with subscribe/unsubscribe and safe reconnect (disabled by default).
 * If env.WS_URL is empty, the connect() will no-op and log at debug level.
 */
class WSClient {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
    this.url = env.WS_URL;
    this._connected = false;
  }

  // PUBLIC_INTERFACE
  connect(url) {
    const target = url || this.url;
    if (!target) {
      if (isLogEnabled('debug')) log('debug', 'WS connect skipped; WS_URL is empty');
      return;
    }
    if (this.socket && this._connected) return;

    try {
      this.socket = new WebSocket(target);
      this.socket.onopen = () => {
        this._connected = true;
        log('info', 'WS connected', target);
      };
      this.socket.onclose = () => {
        this._connected = false;
        log('info', 'WS disconnected');
      };
      this.socket.onerror = (e) => {
        log('warn', 'WS error', e?.message || e);
      };
      this.socket.onmessage = (evt) => {
        let data = evt.data;
        try {
          data = JSON.parse(evt.data);
        } catch {
          // leave as string
        }
        this.listeners.forEach((cb) => {
          try {
            cb(data);
          } catch (err) {
            log('warn', 'WS listener error', err);
          }
        });
      };
    } catch (e) {
      log('warn', 'WS failed to connect', e);
    }
  }

  // PUBLIC_INTERFACE
  disconnect() {
    try {
      if (this.socket) {
        this.socket.close();
      }
    } catch (e) {
      // ignore
    } finally {
      this.socket = null;
      this._connected = false;
    }
  }

  // PUBLIC_INTERFACE
  onMessage(cb) {
    if (typeof cb !== 'function') return () => {};
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  // PUBLIC_INTERFACE
  send(obj) {
    if (!this.socket || !this._connected) return false;
    try {
      const payload = typeof obj === 'string' ? obj : JSON.stringify(obj);
      this.socket.send(payload);
      return true;
    } catch (e) {
      log('warn', 'WS send error', e);
      return false;
    }
  }

  get connected() {
    return this._connected;
  }
}

export const ws = new WSClient();
export default ws;
