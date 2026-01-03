<script>
  import { onMount } from "svelte";
  import Router from "./router.svelte";

  // Global app state
  let isAuthenticated = false;
  let currentUser = null;
  let appReady = false;

  onMount(async () => {
    // Check authentication status on app load
    await checkAuth();
    appReady = true;
  });

  async function checkAuth() {
    try {
      // Replace with your actual auth check
      // Example: const response = await fetch('/api/auth/check');
      // const data = await response.json();
      // isAuthenticated = data.authenticated;
      // currentUser = data.user;

      // Placeholder - check localStorage or session
      const token = localStorage.getItem("authToken");
      if (token) {
        isAuthenticated = true;
        currentUser = { name: "User" }; // Replace with actual user data
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      isAuthenticated = false;
    }
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    isAuthenticated = false;
    currentUser = null;
    // Redirect to login or home
    window.location.href = "/";
  }

  function handleLogin(user) {
    isAuthenticated = true;
    currentUser = user;
  }
</script>

<main class="app">
  {#if !appReady}
    <div class="app-loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  {:else}
    <Router
      {isAuthenticated}
      {currentUser}
      on:logout={handleLogout}
      on:login={(e) => handleLogin(e.detail)}
    />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    background: #f5f5f5;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .app-loading p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
</style>