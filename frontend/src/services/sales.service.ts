import { apiRequest } from './http'
import type { CreateSalePayload, Sale, SaleStatus } from '@/types/Sale'
import type { PaginatedResponse } from '@/types/Pagination'

interface ListSalesParams {
  page?: number
  limit?: number
  status?: SaleStatus
  bird_id?: number
  [key: string]: string | number | boolean | undefined
}

export const salesService = {
  create(payload: CreateSalePayload) {
    return apiRequest<Sale>('/sales', { method: 'POST', body: payload })
  },
  list(params: ListSalesParams = {}) {
    return apiRequest<PaginatedResponse<Sale>>('/sales', { query: params })
  },
  cancelReservation(id: number) {
    return apiRequest<Sale>(`/sales/${id}/cancel`, { method: 'PATCH' })
  },
}
