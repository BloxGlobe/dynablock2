// src/module/auth-module/auth.js

import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

import Login from './register-login/login.js';
import Register from './register-login/register.js';

/* ---------------- SESSION MANAGER ---------------- */

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  REMEMBER: 'remember_me'
};

const SessionManager = {
  _user: null,
  _token: null,

  load() {
    try {
      const remember = localStorage.getItem(STORAGE_KEYS.REMEMBER) === '1';
      const storage = remember ? localStorage : sessionStorage;

      this._token = storage.getItem(STORAGE_KEYS.TOKEN);
      const user = storage.getItem(STORAGE_KEYS.USER);
      this._user = user ? JSON.parse(user) : null;
    } catch {
      this._user = null;
      this._token = null;
    }
  },

  login(user, token, remember) {
    this._user = user;
    this._token = token;

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.TOKEN, token);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER, '1');
    }
  },

  logout() {
    this._user = null;
    this._token = null;

    localStorage.clear();
    sessionStorage.clear();
  },

  isAuthenticated() {
    return !!this._token;
  },

  getUser() {
    return this._user;
  }
};

SessionManager.load();
window.SessionManager = SessionManager;

/* ---------------- REACT ROOT HANDLING ---------------- */

let root = null;

function mount(Component, container) {
  if (root) root.unmount();
  root = ReactDOM.createRoot(container);
  root.render(React.createElement(Component));
}

export function cleanupAuth() {
  if (root) {
    root.unmount();
    root = null;
  }
}

/* ---------------- PUBLIC RENDER API ---------------- */

export function renderLogin(container) {
  mount(Login, container);
}

export function renderRegister(container) {
  mount(Register, container);
}

/* ---------------- EVENT BRIDGE ---------------- */

export function initAuth() {
  if (window.__authInitialized) return;
  window.__authInitialized = true;

  window.addEventListener('session:login', (e) => {
    const { user, token, rememberMe } = e.detail;
    SessionManager.login(user, token, rememberMe);
  });

  window.addEventListener('session:logout', () => {
    SessionManager.logout();
  });
}

/* ---------------- HELPERS ---------------- */

export function isAuthenticated() {
  return SessionManager.isAuthenticated();
}

export function getCurrentUser() {
  return SessionManager.getUser();
}

export function logout() {
  SessionManager.logout();
  window.dispatchEvent(new Event('session:logout'));

  if (window.navigateToPage) {
    window.navigateToPage('login');
  }
}

/* ---------------- MOCK API ---------------- */

export const authAPI = {
  async login(email, password) {
    await new Promise(r => setTimeout(r, 800));

    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        success: true,
        token: 'demo-token',
        user: { id: 1, username: 'demo', email }
      };
    }

    return { success: false, message: 'Invalid credentials' };
  },

  async register(username, email, password) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      success: true,
      user: { id: Date.now(), username, email }
    };
  }
};

export default {
  renderLogin,
  renderRegister,
  initAuth,
  cleanupAuth,
  isAuthenticated,
  getCurrentUser,
  logout,
  authAPI
};
