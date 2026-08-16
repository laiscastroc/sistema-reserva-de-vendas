<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCartShopping, faChartLine, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <header class="app-header">
    <div class="header-bar page-container">
      <router-link to="/" class="brand">
        <img src="/logo.png" alt="Logo AvesBrasil" class="brand-logo" />
        <div class="brand-text">
          <h1>AvesBrasil</h1>
          <p>Sistema de registro de aves</p>
        </div>
      </router-link>

      <nav class="nav" aria-label="Navegação principal">
        <router-link to="/" class="nav-link">
          <FontAwesomeIcon :icon="faCartShopping" />
          Catálogo
        </router-link>
        <router-link to="/history" class="nav-link">
          <FontAwesomeIcon :icon="faClockRotateLeft" />
          Histórico
        </router-link>
        <router-link to="/dashboard" class="nav-link">
          <FontAwesomeIcon :icon="faChartLine" />
          Dashboard
        </router-link>
      </nav>
    </div>
    <div class="header-wave" aria-hidden="true"></div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-primary);
  position: relative;
  padding-bottom: 22px;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding-top: var(--space-5);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}

.brand-logo {
  height: 48px;
  width: 48px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.brand-text h1 {
  color: #fff;
  font-size: 1.4rem;
  line-height: 1.1;
}

.brand-text p {
  color: #fff;
  font-size: 0.85rem;
  margin: 2px 0 0;
}

.nav {
  display: inline-flex;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.12);
  padding: 6px;
  border-radius: 999px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.14);
}

.nav-link.router-link-exact-active {
  background: var(--color-accent-strong);
  color: var(--color-primary-dark);
}

.header-wave {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 24px;
  background: var(--color-bg);
  clip-path: polygon(0 100%, 100% 100%, 100% 40%, 75% 100%, 50% 40%, 25% 100%, 0 40%);
}

@media (max-width: 640px) {
  .header-bar {
    justify-content: center;
    text-align: center;
  }
  .nav {
    width: 100%;
    justify-content: center;
  }
}
</style>
