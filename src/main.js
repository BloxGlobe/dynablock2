// src/main.js

import "./core-modules/auth-module/auth.js";
import App from "./App.svelte";

// Initialize Svelte app
const app = new App({
  target: document.body
});

export default app;