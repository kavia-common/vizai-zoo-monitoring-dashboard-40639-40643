import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

// PUBLIC_INTERFACE
export const AppContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Provides global application state: theme, dateRange, filters, chat, alerts, navigation and modal.
 * Persists key slices to localStorage and exposes actions to update them.
 */
export function AppProvider({ children }) {
  const initialState = {
    theme: 'neon', // 'neon' | 'light'
    dateRange: { preset: 'Today', from: null, to: null },
    filters: {},
    chat: {
      // Each message: { id, role: 'user'|'assistant'|'system', content, ts, meta? }
      history: [],
      minimized: true,
    },
    alerts: {
      list: [],
      panelOpen: false,
      unreadCount: 0,
    },
    navigation: {
      breadcrumbs: [],
      sidebarOpen: true,
    },
    modal: {
      isOpen: false,
      title: '',
      content: null,
    },
    env: {
      apiBase: process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '',
      wsUrl: process.env.REACT_APP_WS_URL || '',
      frontendUrl: process.env.REACT_APP_FRONTEND_URL || '',
      nodeEnv: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development',
    }
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_THEME':
        return { ...state, theme: action.payload };
      case 'SET_DATE_RANGE':
        return { ...state, dateRange: { ...state.dateRange, ...action.payload } };
      case 'SET_FILTERS':
        return { ...state, filters: { ...state.filters, ...action.payload } };
      case 'ADD_CHAT_MESSAGE': {
        const history = [...state.chat.history, action.payload];
        return { ...state, chat: { ...state.chat, history } };
      }
      case 'SET_CHAT_HISTORY': {
        return { ...state, chat: { ...state.chat, history: Array.isArray(action.payload) ? action.payload : [] } };
      }
      case 'TOGGLE_CHAT':
        return { ...state, chat: { ...state.chat, minimized: !state.chat.minimized } };
      case 'OPEN_ALERTS':
        return { ...state, alerts: { ...state.alerts, panelOpen: true, unreadCount: 0 } };
      case 'CLOSE_ALERTS':
        return { ...state, alerts: { ...state.alerts, panelOpen: false } };
      case 'PUSH_ALERT': {
        const list = [action.payload, ...state.alerts.list].slice(0, 100);
        return { ...state, alerts: { ...state.alerts, list, unreadCount: state.alerts.panelOpen ? 0 : state.alerts.unreadCount + 1 } };
      }
      case 'SET_BREADCRUMBS':
        return { ...state, navigation: { ...state.navigation, breadcrumbs: action.payload } };
      case 'TOGGLE_SIDEBAR':
        return { ...state, navigation: { ...state.navigation, sidebarOpen: !state.navigation.sidebarOpen } };
      case 'OPEN_MODAL':
        return { ...state, modal: { isOpen: true, title: action.payload?.title || '', content: action.payload?.content || null } };
      case 'CLOSE_MODAL':
        return { ...state, modal: { isOpen: false, title: '', content: null } };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    // hydrate from localStorage
    try {
      const persisted = JSON.parse(localStorage.getItem('vizai_app_state') || '{}');
      return {
        ...init,
        ...persisted,
        // ensure shapes
        chat: { ...init.chat, ...(persisted.chat || {}) },
        alerts: { ...init.alerts, ...(persisted.alerts || {}) },
        navigation: { ...init.navigation, ...(persisted.navigation || {}) },
        modal: { ...init.modal, ...(persisted.modal || {}) },
      };
    } catch {
      return init;
    }
  });

  // Persist selected slices (include alerts for unreadCount persistence)
  useEffect(() => {
    const toPersist = {
      theme: state.theme,
      dateRange: state.dateRange,
      filters: state.filters,
      chat: state.chat,
      alerts: { list: state.alerts.list, unreadCount: state.alerts.unreadCount }, // persist core alert state
      navigation: { sidebarOpen: state.navigation.sidebarOpen },
    };
    try {
      localStorage.setItem('vizai_app_state', JSON.stringify(toPersist));
    } catch {
      // ignore quota issues
    }
  }, [state.theme, state.dateRange, state.filters, state.chat, state.alerts.list, state.alerts.unreadCount, state.navigation.sidebarOpen]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme === 'neon' ? 'neon' : 'light');
  }, [state.theme]);

  // Seed a couple of example alerts once if none exist (to demonstrate flows)
  useEffect(() => {
    if ((state.alerts.list || []).length === 0) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const t = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${hh}:${mm}`;
      const samples = [
        { title: 'Caution spike detected', message: 'Unusual vigilance near the fence line.', level: 'warning', behavior: 'caution', time: t, hour: now.getHours(), timeOfDay: 'afternoon', thumb: 'https://placehold.co/160x90?text=Caution', src: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 18 },
        { title: 'Exploration event', message: 'Roaming pattern reached western perimeter.', level: 'info', behavior: 'explore', time: t, hour: now.getHours(), timeOfDay: 'afternoon', thumb: 'https://placehold.co/160x90?text=Explore', src: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: 33 },
      ];
      samples.forEach((s) => dispatch({ type: 'PUSH_ALERT', payload: s }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const actions = useMemo(() => ({
    // PUBLIC_INTERFACE
    setTheme: (variant) => dispatch({ type: 'SET_THEME', payload: variant }),
    // PUBLIC_INTERFACE
    toggleTheme: () => dispatch({ type: 'SET_THEME', payload: state.theme === 'neon' ? 'light' : 'neon' }),
    // PUBLIC_INTERFACE
    setDateRange: (range) => dispatch({ type: 'SET_DATE_RANGE', payload: range }),
    // PUBLIC_INTERFACE
    setFilters: (f) => dispatch({ type: 'SET_FILTERS', payload: f }),
    // PUBLIC_INTERFACE
    addChatMessage: (m) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: m }),
    // PUBLIC_INTERFACE
    setChatHistory: (arr) => dispatch({ type: 'SET_CHAT_HISTORY', payload: arr }),
    // PUBLIC_INTERFACE
    toggleChat: () => dispatch({ type: 'TOGGLE_CHAT' }),
    // PUBLIC_INTERFACE
    openAlerts: () => dispatch({ type: 'OPEN_ALERTS' }),
    // PUBLIC_INTERFACE
    closeAlerts: () => dispatch({ type: 'CLOSE_ALERTS' }),
    // PUBLIC_INTERFACE
    pushAlert: (a) => dispatch({ type: 'PUSH_ALERT', payload: a }),
    // PUBLIC_INTERFACE
    setBreadcrumbs: (crumbs) => dispatch({ type: 'SET_BREADCRUMBS', payload: crumbs }),
    // PUBLIC_INTERFACE
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    // PUBLIC_INTERFACE
    openModal: (payload) => dispatch({ type: 'OPEN_MODAL', payload }),
    // PUBLIC_INTERFACE
    closeModal: () => dispatch({ type: 'CLOSE_MODAL' }),
  }), [state.theme]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access app state and actions
 */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
