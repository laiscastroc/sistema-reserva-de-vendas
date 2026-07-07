<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFeather, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

withDefaults(
  defineProps<{
    title: string
    description?: string
    variant?: 'empty' | 'error'
    actionLabel?: string
  }>(),
  { variant: 'empty' }
)

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="state-box" :class="variant">
    <FontAwesomeIcon :icon="variant === 'error' ? faTriangleExclamation : faFeather" class="icon" />
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <button v-if="actionLabel" class="btn btn-primary" @click="emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.state-box {
  text-align: center;
  padding: var(--space-7) var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  color: var(--color-muted);
}

.state-box .icon {
  font-size: 2rem;
  color: var(--color-primary-light);
  margin-bottom: var(--space-3);
}

.state-box.error .icon {
  color: var(--color-danger);
}

.state-box h3 {
  color: var(--color-ink);
  margin-bottom: var(--space-2);
}

.state-box .btn {
  margin-top: var(--space-4);
}
</style>
