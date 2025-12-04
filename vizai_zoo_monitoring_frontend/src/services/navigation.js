import { APP_ROUTES } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Simple navigation helpers. Works with react-router's navigate() function.
 */

// PUBLIC_INTERFACE
export function goTo(navigate, routeName, params) {
  const path = routePathByName(routeName, params);
  navigate(path);
}

// PUBLIC_INTERFACE
export function back(navigate) {
  navigate(-1);
}

// PUBLIC_INTERFACE
export function routePathByName(name, params) {
  switch (name) {
    case 'dashboard':
      return APP_ROUTES.dashboard;
    case 'timeline':
      return APP_ROUTES.timeline;
    case 'reports':
      return APP_ROUTES.reports;
    case 'chat':
      return APP_ROUTES.chat;
    case 'live':
      return APP_ROUTES.liveFeed;
    case 'alerts':
      return APP_ROUTES.alerts;
    case 'history':
      return APP_ROUTES.history;
    case 'settings':
      return APP_ROUTES.settings;
    case 'welcome':
      return APP_ROUTES.welcome;
    case 'register':
      return APP_ROUTES.register;
    case 'login':
      return APP_ROUTES.login;
    case 'animals':
      return APP_ROUTES.animals;
    default:
      return APP_ROUTES.dashboard;
  }
}

// PUBLIC_INTERFACE
export const routes = {
  dashboard: () => APP_ROUTES.dashboard,
  timeline: (q) => withQuery(APP_ROUTES.timeline, q),
  reports: (q) => withQuery(APP_ROUTES.reports, q),
  chat: () => APP_ROUTES.chat,
  animals: () => APP_ROUTES.animals,
  login: () => APP_ROUTES.login,
  register: () => APP_ROUTES.register,
};

// helpers
function withQuery(path, q) {
  if (!q || typeof q !== 'object') return path;
  const search = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    search.set(k, String(v));
  });
  const s = search.toString();
  return s ? `${path}?${s}` : path;
}

export default {
  goTo,
  back,
  routePathByName,
  routes,
};
