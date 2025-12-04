export const APP_ROUTES = {
  dashboard: '/',
  liveFeed: '/live',
  alerts: '/alerts',
  history: '/history',
  settings: '/settings',
  welcome: '/welcome',
  register: '/register',
  login: '/login',
  animals: '/animals',
};

export const NAV_ITEMS = [
  { to: APP_ROUTES.dashboard, label: 'Dashboard', icon: '🏠' },
  { to: APP_ROUTES.liveFeed, label: 'Live Feed', icon: '📹' },
  { to: APP_ROUTES.alerts, label: 'Alerts', icon: '🔔' },
  { to: APP_ROUTES.history, label: 'History', icon: '📜' },
  { to: APP_ROUTES.settings, label: 'Settings', icon: '⚙️' },
];

// Behavior color palette (for future data viz / alert levels)
export const BEHAVIOR_COLORS = {
  curiosity: '#F4A259',
  calm: '#3C6E71',
  caution: '#EDC948',
  explore: '#88BDBC',
};

export function routeToCrumbs(pathname) {
  // very basic crumb builder
  const map = {
    '/': [{ to: '/', label: 'Home' }],
    '/live': [{ to: '/', label: 'Home' }, { to: '/live', label: 'Live Feed' }],
    '/alerts': [{ to: '/', label: 'Home' }, { to: '/alerts', label: 'Alerts' }],
    '/history': [{ to: '/', label: 'Home' }, { to: '/history', label: 'History' }],
    '/settings': [{ to: '/', label: 'Home' }, { to: '/settings', label: 'Settings' }],
    '/animals': [{ to: '/', label: 'Home' }, { to: '/animals', label: 'Animals' }],
    '/welcome': [{ to: '/welcome', label: 'Welcome' }],
    '/register': [{ to: '/register', label: 'Register' }],
    '/login': [{ to: '/login', label: 'Login' }],
  };
  return map[pathname] || [{ to: '/', label: 'Home' }];
}
