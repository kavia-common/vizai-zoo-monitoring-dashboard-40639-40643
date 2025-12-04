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
  { to: APP_ROUTES.dashboard, label: 'Dashboard', icon: '\ud83c\udfe0' },
  { to: APP_ROUTES.timeline, label: 'Timeline', icon: '\u23f3' },
  { to: APP_ROUTES.reports, label: 'Reports', icon: '\ud83d\udcc8' },
  { to: APP_ROUTES.chat, label: 'Chat', icon: '\ud83d\udcac' },
];

/**
 * PUBLIC_INTERFACE
 * Standardized behaviors across app.
 */
export const BEHAVIORS = [
  { key: 'pacing', label: 'Pacing' },
  { key: 'moving', label: 'Moving' },
  { key: 'scratching', label: 'Scratching' },
  { key: 'recumbent', label: 'Recumbent' },
  { key: 'non_recumbent', label: 'Non-Recumbent' },
];

// Behavior color palette (for data viz)
export const BEHAVIOR_COLORS = {
  pacing: '#F59E0B',
  moving: '#10B981',
  scratching: '#EF4444',
  recumbent: '#3B82F6',
  non_recumbent: '#8B5CF6',
};

export function routeToCrumbs(pathname) {
  const map = {
    [APP_ROUTES.animals]: [{ to: APP_ROUTES.animals, label: 'Animals' }],
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
    [APP_ROUTES.welcome]: [{ to: APP_ROUTES.welcome, label: 'Welcome' }],
    [APP_ROUTES.register]: [{ to: APP_ROUTES.register, label: 'Register' }],
    [APP_ROUTES.login]: [{ to: APP_ROUTES.login, label: 'Login' }],
  };
  return map[pathname] || [{ to: APP_ROUTES.dashboard, label: 'Dashboard' }];
}
