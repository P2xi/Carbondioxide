<script setup></script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="title">
        <h1>Carbondioxide</h1>
        <p>Dijital Karbon Ayak İzi Hesaplayıcı</p>
      </div>
      <nav class="top-nav">
        <RouterLink to="/">Uygulama</RouterLink>
        <RouterLink to="/about">Hakkında</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f5f7;
  color: #111827;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.app-header {
  padding: 1rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f766e;
  color: white;
  box-shadow: 0 2px 6px rgba(15, 118, 110, 0.3);
}

.title h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.title p {
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.top-nav {
  display: flex;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.top-nav a {
  color: #e5e7eb;
  text-decoration: none;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.top-nav a.router-link-active {
  background: #facc15;
  color: #0f172a;
}

.app-main {
  flex: 1;
  padding: 1.5rem 1rem;
}
</style>
