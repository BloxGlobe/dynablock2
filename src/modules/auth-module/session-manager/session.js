// src/module/auth-module/session.js

export function isAuthenticated() {
  return window.SessionManager?.isAuthenticated() || false;
}

export function getUser() {
  return window.SessionManager?.getUser() || null;
}

export function requireAuth() {
  if (!isAuthenticated()) {
    if (window.navigateToPage) {
      window.navigateToPage('login');
    }
    return false;
  }
  return true;
}

export function logout() {
  if (window.SessionManager) {
    window.SessionManager.logout();
  }

  window.dispatchEvent(new Event('session:logout'));

  if (window.navigateToPage) {
    window.navigateToPage('login');
  }
}
