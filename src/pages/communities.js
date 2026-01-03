// load css once
if (!document.getElementById("communities-css")) {
  const link = document.createElement("link");
  link.id = "communities-css";
  link.rel = "stylesheet";
  link.href = "src/pages/page-modules/communities-module/communities-css/communities.css";
  document.head.appendChild(link);
}

let communities = [];
let currentCommunity = null;

function initCommunities(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="communities-layout">

      <aside class="communities-sidebar">
        <div class="sidebar-header">Communities</div>

        <div class="search-communities">
          <input type="text" placeholder="Search communities" />
        </div>

        <div class="communities-list"></div>
      </aside>

      <main class="community-content"></main>

    </div>
  `;

  setupEvents();
  renderSidebar();
  renderEmptyState();
}

function setupEvents() {
  const search = document.querySelector(".search-communities input");
  if (!search) return;

  search.addEventListener("input", () => {
    renderSidebar(search.value.toLowerCase());
  });
}

function renderSidebar(filter = "") {
  const list = document.querySelector(".communities-list");
  if (!list) return;

  let filtered = communities;

  if (filter) {
    filtered = communities.filter(c =>
      c.name.toLowerCase().includes(filter)
    );
  }

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty">No joined communities</div>`;
    return;
  }

  list.innerHTML = filtered.map(c => `
    <div class="community-item ${currentCommunity?.id === c.id ? "active" : ""}" data-id="${c.id}">
      <img src="${c.icon}" />
      <div class="community-meta">
        <div class="community-name">${c.name}</div>
        <div class="community-members">${formatMembers(c.members)} members</div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".community-item").forEach(item => {
    item.onclick = () => selectCommunity(item.dataset.id);
  });
}

function renderEmptyState() {
  const content = document.querySelector(".community-content");
  if (!content) return;

  content.innerHTML = `
    <div class="empty-state">
      <h2>Not in any communities</h2>
      <p>Join a community to see its content here</p>
    </div>
  `;
}

function selectCommunity(id) {
  currentCommunity = communities.find(c => c.id === id);
  renderSidebar();
  renderCommunity();
}

function renderCommunity() {
  const content = document.querySelector(".community-content");
  if (!content) return;

  if (!currentCommunity) {
    renderEmptyState();
    return;
  }

  content.innerHTML = `
    <div class="community-banner">
      <img class="community-avatar" src="${currentCommunity.icon}" />
      <div class="community-info">
        <h1>${currentCommunity.name}</h1>
        <div class="community-creator">By ${currentCommunity.creator}</div>
        <div class="community-stats">
          <span>${formatMembers(currentCommunity.members)} Members</span>
          ${currentCommunity.rank ? `<span>${currentCommunity.rank}</span>` : ""}
        </div>
      </div>
    </div>

    <div class="community-tabs">
      <button class="active">About</button>
      <button>Store</button>
    </div>

    <section class="community-section">
      <h3>Description</h3>
      <p>${currentCommunity.description || "No description provided."}</p>
    </section>

    <section class="community-section">
      <h3>Shout</h3>
      ${renderShouts()}
    </section>

    <section class="community-section">
      <h3>Members</h3>
      <div class="members-row">
        ${renderMembers()}
      </div>
    </section>
  `;
}

function renderShouts() {
  if (!currentCommunity.shouts || currentCommunity.shouts.length === 0) {
    return `<div class="empty">No shouts yet</div>`;
  }

  return currentCommunity.shouts.map(s => `
    <div class="shout-item">
      <img src="${s.avatar}" />
      <div>
        <div class="shout-header">
          <strong>${s.author}</strong>
          <span>${s.time}</span>
        </div>
        <div>${s.text}</div>
      </div>
    </div>
  `).join("");
}

function renderMembers() {
  if (!currentCommunity.members_list || currentCommunity.members_list.length === 0) {
    return `<div class="empty">No members</div>`;
  }

  return currentCommunity.members_list.slice(0, 20).map(m => `
    <img class="member-avatar" src="${m.avatar}" title="${m.name}" />
  `).join("");
}

function formatMembers(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

window.initCommunities = initCommunities;
export default initCommunities;
