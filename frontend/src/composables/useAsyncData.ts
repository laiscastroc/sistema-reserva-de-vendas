import { ref, type Ref } from 'vue'
import { ApiRequestError } from '@/services/http'

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = err instanceof ApiRequestError ? err.message : 'Erro inesperado.'
    } finally {
      loading.value = false
    }
  }
  return { data, loading, error, execute }
}
