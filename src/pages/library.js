// src/pages/library.js

/* load css once */
if (!document.getElementById("library-css")) {
  const link = document.createElement("link");
  link.id = "library-css";
  link.rel = "stylesheet";
  link.href = "src/utils/css/library.css";
  document.head.appendChild(link);
}

export default function initLibrary(container) {
  container.innerHTML = `
    <div class="library-page">

      <header class="library-header">
        <h1>Library</h1>
        <p>Your activity, communities, and saved content</p>
      </header>

      <!-- Recent Users -->
      <section class="library-section">
        <div class="section-header">
          <h2>Recent Users</h2>
          <button class="see-all">See All</button>
        </div>

        <div class="card-row">
          ${renderUserCard("Alex")}
          ${renderUserCard("BuilderGuy")}
          ${renderUserCard("PixelDev")}
        </div>
      </section>

      <!-- Communities -->
      <section class="library-section">
        <div class="section-header">
          <h2>Communities</h2>
          <button class="see-all">See All</button>
        </div>

        <div class="card-row">
          ${renderCommunityCard("DynaBlocks")}
          ${renderCommunityCard("Game Builders")}
          ${renderCommunityCard("UI Designers")}
        </div>
      </section>

      <!-- Saved / Favorites -->
      <section class="library-section">
        <div class="section-header">
          <h2>Saved</h2>
          <button class="see-all">See All</button>
        </div>

        <div class="card-row">
          ${renderGenericCard("Saved Item")}
          ${renderGenericCard("Pinned Resource")}
        </div>
      </section>

    </div>
  `;
}

/* card helpers */

function renderUserCard(name) {
  return `
    <div class="library-card user-card">
      <div class="avatar"></div>
      <span>${name}</span>
    </div>
  `;
}

function renderCommunityCard(name) {
  return `
    <div class="library-card community-card">
      <div class="icon"></div>
      <span>${name}</span>
    </div>
  `;
}

function renderGenericCard(label) {
  return `
    <div class="library-card generic-card">
      <div class="icon"></div>
      <span>${label}</span>
    </div>
  `;
}
