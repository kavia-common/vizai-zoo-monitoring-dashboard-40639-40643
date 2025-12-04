export const APP_ROUTES = {
  dashboard: '/dashboard',
  timeline: '/timeline',
  reports: '/reports',
  chat: '/chat',
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
  { to: APP_ROUTES.animals, label: 'Animals', icon: '🦓' },
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
  const map = {
    [APP_ROUTES.dashboard]: [
      { to: APP_ROUTES.animals, label: 'Animals' },
      { to: APP_ROUTES.dashboard, label: 'Giant Anteater' },
      { to: APP_ROUTES.dashboard, label: 'Dashboard' },
    ],
    [APP_ROUTES.timeline]: [
      { to: APP_ROUTES.animals, label: 'Animals' },
      { to: APP_ROUTES.dashboard, label: 'Giant Anteater' },
      { to: APP_ROUTES.timeline, label: 'Timeline' },
    ],
    [APP_ROUTES.reports]: [
      { to: APP_ROUTES.animals, label: 'Animals' },
      { to: APP_ROUTES.dashboard, label: 'Giant Anteater' },
      { to: APP_ROUTES.reports, label: 'Reports' },
    ],
    [APP_ROUTES.chat]: [
      { to: APP_ROUTES.animals, label: 'Animals' },
      { to: APP_ROUTES.dashboard, label: 'Giant Anteater' },
      { to: APP_ROUTES.chat, label: 'Chat' },
    ],
    [APP_ROUTES.liveFeed]: [{ to: APP_ROUTES.liveFeed, label: 'Live Feed' }],
    [APP_ROUTES.alerts]: [{ to: APP_ROUTES.alerts, label: 'Alerts' }],
    [APP_ROUTES.history]: [{ to: APP_ROUTES.history, label: 'History' }],
    [APP_ROUTES.settings]: [{ to: APP_ROUTES.settings, label: 'Settings' }],
    [APP_ROUTES.animals]: [{ to: APP_ROUTES.animals, label: 'Animals' }],
    [APP_ROUTES.welcome]: [{ to: APP_ROUTES.welcome, label: 'Welcome' }],
    [APP_ROUTES.register]: [{ to: APP_ROUTES.register, label: 'Register' }],
    [APP_ROUTES.login]: [{ to: APP_ROUTES.login, label: 'Login' }],
  };
  return map[pathname] || [{ to: APP_ROUTES.dashboard, label: 'Dashboard' }];
}
