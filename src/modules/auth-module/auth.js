// src/module/auth-module/auth.js

const API = "/api/auth";

const Auth = {
  user: null,
  isAuthenticated: false,

  async init() {
    await this.restoreSession();
    this.expose();
    console.log("[Auth] connected to backend");
  },

  async restoreSession() {
    try {
      const res = await fetch(`${API}/session`);
      if (!res.ok) return;

      const user = await res.json();
      if (user) {
        this.user = user;
        this.isAuthenticated = true;
      }
    } catch {}
  },

  async login(data) {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const user = await res.json();
    this._setUser(user);

    document.dispatchEvent(
      new CustomEvent("auth:login", { detail: user })
    );

    return user;
  },

  async signup(data) {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Signup failed");
    }

    const user = await res.json();
    this._setUser(user);

    document.dispatchEvent(
      new CustomEvent("auth:signup", { detail: user })
    );

    return user;
  },

  logout() {
    fetch(`${API}/logout`, { method: "POST" });
    this.user = null;
    this.isAuthenticated = false;

    document.dispatchEvent(new CustomEvent("auth:logout"));
  },

  requireAuth() {
    if (!this.isAuthenticated) {
      throw new Error("Authentication required");
    }
  },

  _setUser(user) {
    this.user = user;
    this.isAuthenticated = true;
  },

  expose() {
    window.Auth = this;
  }
};

Auth.init();
export default Auth;
