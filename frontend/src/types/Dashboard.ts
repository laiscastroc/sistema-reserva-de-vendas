export interface DashboardKpis {
  totalSales: number
  totalReservations: number
  totalCancelled: number
  totalRevenue: number
  totalLegalizationRevenue: number
  averageTicket: number
  birdsSold: number
}

export interface RevenueByDay {
  day: string
  revenue: number
  salesCount: number
}

export interface TopBird {
  birdName: string
  totalQuantity: number
  totalRevenue: number
}

export interface RevenueByPaymentMethod {
  paymentMethod: string
  count: number
  revenue: number
}

export interface StatusBreakdown {
  status: string
  count: number
}

export interface LowStockBird {
  id: number
  name: string
  stock: number
}

export interface DashboardSummary {
  kpis: DashboardKpis
  revenueByDay: RevenueByDay[]
  topBirds: TopBird[]
  revenueByPaymentMethod: RevenueByPaymentMethod[]
  statusBreakdown: StatusBreakdown[]
  lowStockBirds: LowStockBird[]
}
