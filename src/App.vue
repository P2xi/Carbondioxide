<script setup>
import { onMounted, ref, watch } from 'vue'
import { BRANDING } from './constants/branding'
import TreeLoader from './components/TreeLoader.vue'

const isForestTheme = ref(false)
const showLoader = ref(true)

onMounted(() => {
  isForestTheme.value = localStorage.getItem('cd_theme') === 'forest'
  window.setTimeout(() => {
    showLoader.value = false
  }, 1100)
})

watch(isForestTheme, (enabled) => {
  localStorage.setItem('cd_theme', enabled ? 'forest' : 'light')
})
</script>

<template>
  <div id="app" :class="{ 'theme-forest': isForestTheme }">
    <Transition name="loader-fade">
      <TreeLoader v-if="showLoader" />
    </Transition>

    <span class="ambient-orb ambient-orb-one" aria-hidden="true"></span>
    <span class="ambient-orb ambient-orb-two" aria-hidden="true"></span>
    <header class="app-header">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">CO2</span>
        <span>
          <strong>{{ BRANDING.platformName }}</strong>
          <small>{{ BRANDING.poweredBy }}</small>
        </span>
      </RouterLink>

      <div class="nav-actions">
        <nav class="top-nav" aria-label="Ana menü">
          <input
            id="theme-toggle"
            v-model="isForestTheme"
            type="checkbox"
            name="check-toggle"
            hidden=""
          />
          <label for="theme-toggle" class="theme-toggle" aria-label="Forest mode">
            <div class="theme-toggle__circle"></div>
          </label>
          <RouterLink to="/">Uygulama</RouterLink>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/about">Hakkında</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
:global(:root) {
  --bg: #f3faf7;
  --surface: rgba(255, 255, 255, 0.86);
  --surface-soft: rgba(255, 255, 255, 0.62);
  --text: #0f172a;
  --muted: #64748b;
  --accent: #0f9f8f;
  --accent-strong: #0f766e;
  --accent-soft: rgba(20, 184, 166, 0.14);
  --yellow: #facc15;
  --border: rgba(15, 23, 42, 0.1);
  --shadow: rgba(15, 23, 42, 0.1);
  --input-bg: rgba(255, 255, 255, 0.82);
}

#app {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, 0.18), transparent 35rem),
    radial-gradient(circle at 85% 8%, rgba(250, 204, 21, 0.13), transparent 28rem),
    radial-gradient(circle at 50% 52%, rgba(37, 99, 235, 0.055), transparent 34rem),
    linear-gradient(135deg, rgba(15, 23, 42, 0.03), transparent 42%),
    var(--bg);
  color: var(--text);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  transition:
    background-color 220ms ease,
    color 220ms ease;
}

#app.theme-forest {
  --bg: #071f1b;
  --surface: rgba(12, 48, 41, 0.82);
  --surface-soft: rgba(12, 48, 41, 0.62);
  --text: #f4fff9;
  --muted: #b8d8cf;
  --accent: #16c7a7;
  --accent-strong: #16c7a7;
  --accent-soft: rgba(22, 199, 167, 0.14);
  --yellow: #facc15;
  --border: rgba(184, 216, 207, 0.18);
  --shadow: rgba(0, 0, 0, 0.28);
  --input-bg: rgba(12, 48, 41, 0.72);
  background:
    radial-gradient(circle at top left, rgba(22, 199, 167, 0.18), transparent 35rem),
    radial-gradient(circle at 85% 8%, rgba(250, 204, 21, 0.1), transparent 28rem),
    radial-gradient(circle at 50% 52%, rgba(22, 199, 167, 0.07), transparent 34rem),
    linear-gradient(135deg, rgba(244, 255, 249, 0.035), transparent 42%),
    var(--bg);
}

#app::before {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.1) 1px, transparent 0),
    linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 40%, rgba(20, 184, 166, 0.05));
  background-size:
    18px 18px,
    100% 100%;
  opacity: 0.22;
  content: '';
}

.ambient-orb {
  position: fixed;
  z-index: 0;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(22, 199, 167, 0.16), transparent 70%);
  filter: blur(40px);
  opacity: 0.58;
  pointer-events: none;
  transform: translate3d(0, 0, 0) scale(1);
  animation: orbDrift 14s ease-in-out infinite alternate;
  will-change: transform;
}

.ambient-orb-one {
  top: 12%;
  right: 6%;
}

.ambient-orb-two {
  bottom: 4%;
  left: 3%;
  width: 340px;
  height: 340px;
  opacity: 0.34;
  animation-delay: -5s;
}

#app.theme-forest .ambient-orb {
  opacity: 0.76;
}

@keyframes orbDrift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(40px, -30px, 0) scale(1.08);
  }
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem clamp(1rem, 4vw, 2.5rem);
  background: color-mix(in srgb, var(--surface) 84%, transparent);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 10px 30px var(--shadow);
  backdrop-filter: blur(18px);
  transition:
    background-color 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.app-header,
.app-main {
  position: relative;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
  color: var(--text);
  text-decoration: none;
}

.brand-mark {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0f766e, #14b8a6 58%, #facc15);
  color: #ffffff;
  font-weight: 900;
  font-size: 0.78rem;
  box-shadow: 0 14px 28px rgba(15, 118, 110, 0.22);
}

.brand strong,
.brand small {
  display: block;
  line-height: 1.2;
}

.brand strong {
  font-size: 1.16rem;
  font-weight: 950;
  letter-spacing: 0;
}

.brand small {
  margin-top: 0.18rem;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 650;
  opacity: 0.76;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.top-nav {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 14px;
  padding: 0.34rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 58%, transparent);
  border: 1px solid var(--border);
  box-shadow: 0 16px 34px var(--shadow);
  backdrop-filter: blur(18px);
}

.top-nav a {
  display: inline-grid;
  place-items: center;
  min-width: 110px;
  min-height: 42px;
  padding: 0.66rem 1.08rem;
  border-radius: 999px;
  color: var(--text);
  text-align: center;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 900;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.top-nav a:hover {
  background: color-mix(in srgb, var(--surface) 76%, transparent);
  transform: translateY(-1px);
}

.top-nav a.router-link-active {
  background: linear-gradient(135deg, var(--accent-strong), var(--accent));
  color: #ffffff;
  box-shadow:
    0 10px 22px rgba(15, 118, 110, 0.22),
    0 0 0 6px rgba(20, 184, 166, 0.1);
}

.theme-toggle {
  position: relative;
  width: 52px;
  height: 30px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  padding: 3px;
  background: rgba(255, 255, 255, 0.56);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition:
    background 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease,
    transform 220ms ease;
}

.theme-toggle::after {
  position: absolute;
  top: -6px;
  right: 8px;
  width: 15px;
  height: 10px;
  border-radius: 100% 0% 100% 0% / 100% 0% 100% 0%;
  background: linear-gradient(135deg, #67a81f, #2f7d18);
  box-shadow:
    0 3px 7px rgba(15, 23, 42, 0.16),
    0 0 10px rgba(103, 168, 31, 0.18);
  opacity: 0.9;
  pointer-events: none;
  transform: rotate(-18deg);
  transform-origin: bottom left;
  transition:
    opacity 220ms ease,
    transform 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease;
  content: '';
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  transform: scale(1.025);
}

.theme-toggle__circle {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffffff, #d9fff3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  transition:
    transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
    background 220ms ease;
  will-change: transform;
}

#theme-toggle:checked + .theme-toggle {
  border-color: rgba(22, 199, 167, 0.24);
  background: linear-gradient(135deg, #0f766e, #16c7a7);
  box-shadow: 0 10px 22px rgba(22, 199, 167, 0.14);
}

#theme-toggle:checked + .theme-toggle .theme-toggle__circle {
  background: linear-gradient(135deg, #ffffff, #d9fff3);
  transform: translateX(22px);
}

#theme-toggle:checked + .theme-toggle::after {
  background: linear-gradient(135deg, #a7f05a, #16c7a7);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.18),
    0 0 12px rgba(22, 199, 167, 0.22);
  opacity: 0.96;
  transform: rotate(-8deg) scale(1.03);
  animation: leafSettle 520ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes leafSettle {
  0% {
    transform: rotate(-18deg) scale(0.96);
  }

  55% {
    transform: rotate(-4deg) scale(1.08);
  }

  100% {
    transform: rotate(-8deg) scale(1.03);
  }
}

.app-main {
  padding: 1rem clamp(0.75rem, 3vw, 1.5rem) 2rem;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition:
    opacity 320ms ease,
    transform 320ms ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
  transform: scale(0.985);
}

@media (max-width: 700px) {
  .app-header {
    align-items: stretch;
    flex-direction: column;
    gap: 0.75rem;
  }

  .top-nav {
    width: 100%;
  }

  .nav-actions {
    align-items: center;
    width: 100%;
  }

  .top-nav a {
    flex: 1;
    min-width: 0;
    min-height: 40px;
    padding-inline: 0.65rem;
  }
}

@media (max-width: 520px) {
  .nav-actions {
    flex-wrap: wrap;
  }

  .theme-toggle {
    margin-left: auto;
  }
}

@media (max-width: 420px) {
  .brand {
    gap: 0.55rem;
  }

  .brand-mark {
    width: 40px;
    height: 40px;
  }

  .brand strong {
    font-size: 1rem;
  }

  .brand small {
    font-size: 0.72rem;
  }

  .top-nav a {
    font-size: 0.82rem;
    padding-inline: 0.45rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }

  .ambient-orb {
    animation: none;
  }
}
</style>
