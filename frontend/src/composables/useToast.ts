import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'info'
export interface Toast {
  id: number
  type: ToastType
  message: string
}

const state = reactive<{ toasts: Toast[] }>({ toasts: [] })
let nextId = 1

function push(type: ToastType, message: string, durationMs = 4000) {
  const id = nextId++
  state.toasts.push({ id, type, message })
  setTimeout(() => dismiss(id), durationMs)
}

function dismiss(id: number) {
  const index = state.toasts.findIndex((toast) => toast.id === id)
  if(index !== -1) state.toasts.splice(index, 1)
}

export function useToast() {
  return {
    toasts: state.toasts,
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    info: (message: string) => push('info', message),
    dismiss,
  }
}
