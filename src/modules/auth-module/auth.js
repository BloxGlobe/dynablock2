// src/module/auth-module/auth.js
// Main authentication module that boots up register/login

import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

// Store React roots for cleanup
const reactRoots = new Map();

// Simple SessionManager used by non-React code (window.SessionManager)
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  REMEMBER: 'remember_me'
};

const SimpleSessionManager = {
  _user: null,
  _token: null,

  _load() {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN);
      const user = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);

      this._token = token || null;
      this._user = user ? JSON.parse(user) : null;
    } catch (e) {
      this._token = null;
      this._user = null;
    }
  },

  login(user, token, remember = false) {
    this._user = user || null;
    this._token = token || null;

    try {
      const storage = remember ? localStorage : sessionStorage;
      if (this._token) storage.setItem(STORAGE_KEYS.TOKEN, this._token);
      if (this._user) storage.setItem(STORAGE_KEYS.USER, JSON.stringify(this._user));
      if (remember) localStorage.setItem(STORAGE_KEYS.REMEMBER, '1');
    } catch (e) {
      console.warn('Session storage failed:', e);
    }

    return true;
  },

  logout() {
    this._user = null;
    this._token = null;
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.warn('Clearing session storage failed:', e);
    }
    return true;
  },

  isAuth() {
    return !!this._token;
  },

  getUser() {
    return this._user;
  },

  getToken() {
    return this._token;
  }
};

// Initialize and expose globally
try {
  SimpleSessionManager._load();
  if (typeof window !== 'undefined') window.SessionManager = SimpleSessionManager;
} catch (e) {
  console.warn('Unable to initialize SessionManager:', e);
}

// Ensure register-login module files are loaded by the browser runtime.
// This guarantees the components are available when routes or other parts
// of the app try to use them (helps environments that rely on side-effect imports).
(async function preloadRegisterLogin() {
  try {
    await Promise.all([
      import('./register-login/login.jsx'),
      import('./register-login/register.jsx')
    ]);
    console.log('register-login modules preloaded');
  } catch (err) {
    console.warn('Failed to preload register-login modules:', err);
  }
})();

/**
 * Mount React component to DOM
 */
function mountReactComponent(Component, container, props = {}) {
  // Clean up existing root if it exists
  if (reactRoots.has(container)) {
    reactRoots.get(container).unmount();
  }
  
  // Create new root and render
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(Component, props));
  reactRoots.set(container, root);
  
  return root;
}

/**
 * Unmount React component
 */
function unmountReactComponent(container) {
  if (reactRoots.has(container)) {
    reactRoots.get(container).unmount();
    reactRoots.delete(container);
  }
}

/**
 * Render Login page
 */
export async function renderLogin(container) {
  try {
    // Import Routes component which handles login/register
    const RoutesModule = await import('./routes/routes.jsx');
    const Routes = RoutesModule.default;
    
    // Mount React component
    mountReactComponent(Routes, container);
    
    console.log('Login module loaded');
    return true;
  } catch (error) {
    console.error('Failed to load login module:', error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <h2>Failed to load authentication module</h2>
        <p style="color: #666;">${error.message}</p>
      </div>
    `;
    return false;
  }
}

/**
 * Render Register page
 */
export async function renderRegister(container) {
  // Same as login - the Routes component handles both
  return renderLogin(container);
}

// Auto-mount when this module is loaded and an auth root exists
if (typeof document !== 'undefined') {
  const autoRoot = document.getElementById('auth-root');
  if (autoRoot) {
    // Fire-and-forget; errors are handled inside renderLogin
    renderLogin(autoRoot).catch(err => console.error('Auto-mount auth failed:', err));
  }
}

/**
 * Initialize auth module
 * Called from main.js on app startup
 */
export function initAuth() {
  console.log('Auth module initialized');
  
  // Listen for session events from React components
  window.addEventListener('session:login', (e) => {
    console.log('User logged in via auth module:', e.detail.user);
    
    // Update SessionManager
    if (window.SessionManager) {
      window.SessionManager.login(
        e.detail.user, 
        e.detail.token, 
        e.detail.rememberMe || false
      );
    }
  });
  
  window.addEventListener('session:logout', () => {
    console.log('User logged out via auth module');
    
    // Clear SessionManager
    if (window.SessionManager) {
      window.SessionManager.logout();
    }
  });
}

/**
 * Cleanup auth module
 */
export function cleanupAuth(container) {
  unmountReactComponent(container);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return window.SessionManager?.isAuth() || false;
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return window.SessionManager?.getUser() || null;
}

/**
 * Logout user
 */
export function logout() {
  if (window.SessionManager) {
    window.SessionManager.logout();
  }
  
  // Navigate to login
  if (window.navigateToPage) {
    window.navigateToPage('login');
  }
}

/**
 * API Integration (Mock for now)
 */
export const authAPI = {
  /**
   * Login API call
   */
  async login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock users
    const mockUsers = [
      { id: 1, username: 'demo', email: 'demo@example.com', password: 'demo123' }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
      const token = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + (24 * 60 * 60 * 1000)
      }));

      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Login successful',
        token: token,
        user: userWithoutPassword
      };
    }

    return {
      success: false,
      message: 'Invalid email or password'
    };
  },

  /**
   * Register API call
   */
  async register(username, email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    const existingEmails = ['demo@example.com', 'test@example.com'];
    
    if (existingEmails.includes(email)) {
      return {
        success: false,
        message: 'Email already registered'
      };
    }

    // Mock successful registration
    const newUser = {
      id: Date.now(),
      username: username,
      email: email,
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Registration successful',
      user: newUser
    };
  },

  /**
   * Verify token
   */
  async verifyToken(token) {
    try {
      const decoded = JSON.parse(atob(token));
      
      if (decoded.exp < Date.now()) {
        return { success: false, message: 'Token expired' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Invalid token' };
    }
  }
};

// Export default object with all functions
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