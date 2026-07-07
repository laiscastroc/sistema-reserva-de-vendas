<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <p>© {{ year }} AvesBrasil | Desenvolvido por: Laís Castro | github.com/laiscastroc</p>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: var(--space-7);
  padding: var(--space-5);
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-muted);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}
</style>
