// src/pages/settings.js

/* load css once */
if (!document.getElementById("settings-css")) {
  const link = document.createElement("link");
  link.id = "settings-css";
  link.rel = "stylesheet";
  link.href = "src/utils/css/settings.css/setting.css";
  document.head.appendChild(link);
}

let settingsOpen = false;

/**
 * Get current user from session
 */
function getCurrentUser() {
  // FIX: use SessionManager API instead of .user
  if (window.SessionManager && typeof window.SessionManager.getUser === 'function') {
    return window.SessionManager.getUser();
  }
  return null;
}

/**
 * Initialize settings panel
 */
export function initSettings(anchorEl) {
  if (settingsOpen || !anchorEl) return;

  const user = getCurrentUser();

  const panel = document.createElement("div");
  panel.id = "settings-panel";

  panel.innerHTML = `
    <div class="settings-dropdown">
      
      ${user ? `
        <div class="settings-user-info">
          <div class="user-avatar">
            ${getUserInitials(user.username)}
          </div>
          <div class="user-details">
            <div class="user-name">${escapeHtml(user.username)}</div>
            <div class="user-email">${escapeHtml(user.email)}</div>
          </div>
        </div>
        <div class="settings-divider"></div>
      ` : ''}

      <button class="settings-item" data-action="account">
        <svg viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Account Info
      </button>

      <button class="settings-item" data-action="settings">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M1 12h6m6 0h6M4.9 4.9l4.2 4.2m5.8 5.8 4.2 4.2M4.9 19.1l4.2-4.2m5.8-5.8 4.2-4.2"/>
        </svg>
        Settings
      </button>

      <button class="settings-item" data-action="help">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        Help & Safety
      </button>

      ${user ? `
        <div class="settings-divider"></div>

        <button class="settings-item" data-action="switch">
          <svg viewBox="0 0 24 24">
            <path d="M16 3h5v5"/>
            <path d="M21 3l-7 7"/>
            <path d="M8 21H3v-5"/>
            <path d="M3 21l7-7"/>
          </svg>
          Switch Accounts
        </button>

        <button class="settings-item danger" data-action="logout">
          <svg viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <path d="M16 17l5-5-5-5"/>
            <path d="M21 12H9"/>
          </svg>
          Logout
        </button>
      ` : `
        <div class="settings-divider"></div>

        <button class="settings-item" data-action="login">
          <svg viewBox="0 0 24 24">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Login
        </button>
      `}
    </div>
  `;

  document.body.appendChild(panel);
  positionPanel(panel, anchorEl);

  settingsOpen = true;

  panel.addEventListener("click", handleAction);
  document.addEventListener("click", outsideClose);
  document.addEventListener("keydown", escClose);
}

/**
 * Handle menu item actions
 */
function handleAction(e) {
  const btn = e.target.closest(".settings-item");
  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {
    case "account":
      window.navigateToPage?.('account');
      break;
    case "settings":
      window.navigateToPage?.('settings');
      break;
    case "help":
      window.navigateToPage?.('help');
      break;
    case "switch":
      alert('Account switcher coming soon!');
      break;
    case "logout":
      handleLogout();
      break;
    case "login":
      window.navigateToPage?.('login');
      break;
  }

  closeSettings();
}

/**
 * Handle logout action
 */
function handleLogout() {
  const confirmed = confirm("Are you sure you want to logout?");
  if (!confirmed) return;

  if (window.SessionManager?.logout) {
    window.SessionManager.logout();
  }

  // FIX: notify rest of app
  window.dispatchEvent(new Event('session:logout'));

  window.navigateToPage?.('home');
}

/* ---- rest unchanged ---- */

function positionPanel(panel, anchor) {
  const rect = anchor.getBoundingClientRect();
  panel.style.top = `${rect.bottom + 8}px`;
  panel.style.right = `${window.innerWidth - rect.right}px`;

  setTimeout(() => {
    const panelRect = panel.getBoundingClientRect();
    if (panelRect.right > window.innerWidth) panel.style.right = '8px';
    if (panelRect.bottom > window.innerHeight) {
      panel.style.top = `${rect.top - panelRect.height - 8}px`;
    }
  }, 0);
}

function closeSettings() {
  const panel = document.getElementById("settings-panel");
  if (!panel) return;

  panel.remove();
  settingsOpen = false;
  document.removeEventListener("click", outsideClose);
  document.removeEventListener("keydown", escClose);
}

function outsideClose(e) {
  const panel = document.getElementById("settings-panel");
  if (panel && !panel.contains(e.target) && !e.target.closest(".settings-btn")) {
    closeSettings();
  }
}

function escClose(e) {
  if (e.key === "Escape") closeSettings();
}

function getUserInitials(username) {
  if (!username) return "U";
  const parts = username.split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
