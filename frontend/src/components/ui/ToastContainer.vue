<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleCheck, faCircleExclamation, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

const icons = {
  success: faCircleCheck,
  error: faCircleExclamation,
  info: faCircleInfo,
}
</script>
<template>
  <Teleport to="body">
    <div class="toast-region" role="region" aria-label="Notificações">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type" role="status">
          <FontAwesomeIcon :icon="icons[toast.type]" class="toast-icon" />
          <p>{{ toast.message }}</p>
          <button class="toast-close" aria-label="Fechar notificação" @click="dismiss(toast.id)">
            <FontAwesomeIcon :icon="faXmark" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-region {
  position: fixed;
  top: var(--space-5);
  right: var(--space-5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 360px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  background: var(--color-surface);
  padding: 14px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--color-primary);
}

.toast p {
  margin: 0;
  font-size: 0.9rem;
  flex: 1;
  color: var(--color-ink);
}

.toast-icon {
  margin-top: 2px;
}

.toast.success {
  border-left-color: var(--color-sage-dark);
}
.toast.success .toast-icon {
  color: var(--color-sage-dark);
}

.toast.error {
  border-left-color: var(--color-danger);
}
.toast.error .toast-icon {
  color: var(--color-danger);
}

.toast.info .toast-icon {
  color: var(--color-primary);
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-muted);
  padding: 0;
  font-size: 0.9rem;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 480px) {
  .toast-region {
    left: var(--space-3);
    right: var(--space-3);
    max-width: none;
  }
}
</style>
