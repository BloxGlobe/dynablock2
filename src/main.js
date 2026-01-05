// src/main.js

import "./modules/auth-module/auth.js"; // auth bootstraps first
import initRouter from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
});
