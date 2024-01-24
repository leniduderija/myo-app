<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <a-config-provider
    :theme="{
      components: {
        Input: {
          colorTextDisabled: '#000'
        }
      }
    }"
  />
  <a-layout class="layout">
    <a-layout-header class="header">
      <a-flex class="container">
        <header>
          <div class="wrapper">
            <a-flex horizontal justify="space-between" flex="1">
              <router-link to="/" style="background: transparent"
                ><img alt="MYO logo" class="logo" src="@/assets/logo.png" width="125"
              /></router-link>
              <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/users">Users</RouterLink>
                <RouterLink to="/users/new">Create User</RouterLink>
              </nav>
            </a-flex>
          </div>
        </header>
      </a-flex>
    </a-layout-header>
    <a-layout-content>
      <a-flex class="container">
        <RouterView />
      </a-flex>
    </a-layout-content>
    <a-layout-footer class="footer">
      <a-flex class="container" justify="center">Copyright by Leni Đuderija</a-flex>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
.header {
  height: auto;
  min-height: 64px;
  padding: 10px 0;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: right;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    width: 100%;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
  }

  nav {
    text-align: right;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
