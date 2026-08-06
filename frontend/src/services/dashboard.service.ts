import { apiRequest } from './http'
import type { DashboardSummary } from '@/types/Dashboard'

export const dashboardService = {
  getSummary(days = 30) {
    return apiRequest<DashboardSummary>('/dashboard/summary', { query: { days } })
  },
}
