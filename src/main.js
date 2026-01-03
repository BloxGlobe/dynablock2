// src/main.js

import "./lib/modules/auth-module/auth.js"; // auth bootstraps first
import initRouter from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
});
