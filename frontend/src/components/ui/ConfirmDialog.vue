<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
  }>(),
  { confirmLabel: 'Confirmar', cancelLabel: 'Cancelar', danger: false }
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="overlay" @click.self="emit('cancel')">
        <div class="dialog" role="alertdialog" aria-modal="true" :aria-label="title">
          <h3 class="dialog-title">{{ title }}</h3>
          <p v-if="description" class="dialog-description">{{ description }}</p>
          <div class="actions">
            <button class="btn btn-outline dialog-cancel" @click="emit('cancel')">{{ cancelLabel }}</button>
            <button
              :class="['btn', danger ? 'btn-danger' : 'btn-primary', 'dialog-confirm']"
              @click="emit('confirm')"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: var(--space-4);
}

.dialog {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  max-width: 420px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.dialog-title {
  color: #006400;
  font-size: 1.2rem;
  margin: 0;
}

.dialog-description {
  color: #4b5563;
  font-size: 0.95rem;
  margin-top: var(--space-2);
}

.dialog-cancel {
  color: #006400;
  border-color: #006400;
}

.dialog-confirm {
  background: #006400;
  color: #fff;
}

.dialog-confirm.btn-danger {
  background: #b91c1c;
  color: #fff;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
