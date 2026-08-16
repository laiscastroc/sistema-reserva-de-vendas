<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

defineProps<{
    label: string
    value: string
    icon: IconDefinition
    tone?: 'primary' |'accent' | 'sage' | 'danger'
}>()
</script>    

<template>
  <div class="kpi-card" :class="tone ?? 'primary'">
    <div class="icon-box">
      <FontAwesomeIcon :icon="icon" />
    </div>
    <div>
      <p class="label">{{ label }}</p>
      <p class="value">{{ value }}</p>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.icon-box {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.kpi-card.primary .icon-box {
  background: rgba(15, 82, 87, 0.1);
  color: var(--color-primary);
}
.kpi-card.accent .icon-box {
  background: rgba(242, 166, 90, 0.18);
  color: var(--color-accent-dark);
}
.kpi-card.sage .icon-box {
  background: rgba(127, 182, 133, 0.18);
  color: var(--color-sage-dark);
}
.kpi-card.danger .icon-box {
  background: rgba(214, 90, 90, 0.14);
  color: var(--color-danger-dark);
}

.label {
  font-size: 0.78rem;
  color: var(--color-muted);
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.value {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--color-ink);
  margin: 2px 0 0;
}
</style>
