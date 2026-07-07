import { apiRequest } from './http'
import type { Bird } from '@/types/Bird'

export const birdsService = {
  getAll(type?: string) {
    return apiRequest<Bird[]>('/birds', { query: { type } })
  },

  getById(id: number) {
    return apiRequest<Bird>(`/birds/${id}`)
  },

  getTypes() {
    return apiRequest<string[]>('/birds/types')
  },
}
