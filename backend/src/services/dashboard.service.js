import { dashboardRepository } from "../repositories/dashboard.repository.js";

//conversão dos campos numeric pra number
//valores de exibição, não retorna nenhuma query

function toNumber(value) {
  return Number(value ?? 0);
}

export const dashboardService = {
  async getSummary({ days, lowStockThreshold }) {
    const [summary, revenueByDay, topBirds, revenueByPaymentMethod, statusBreakdown, lowStockBirds] =
      await Promise.all([
        dashboardRepository.getSummary(),
        dashboardRepository.getRevenueByDay(days),
        dashboardRepository.getTopBirds(5),
        dashboardRepository.getRevenueByPaymentMethod(),
        dashboardRepository.getStatusBreakdown(),
        dashboardRepository.getLowStockBirds(lowStockThreshold),
      ]);

    return {
      kpis: {
        totalSales: summary.total_sales,
        totalReservations: summary.total_reservations,
        totalCancelled: summary.total_cancelled,
        totalRevenue: toNumber(summary.total_revenue),
        totalLegalizationRevenue: toNumber(summary.total_legalization_revenue),
        averageTicket: toNumber(summary.average_ticket),
        birdsSold: summary.birds_sold,
      },
      revenueByDay: revenueByDay.map((row) => ({
        day: row.day,
        revenue: toNumber(row.revenue),
        salesCount: row.sales_count,
      })),
      topBirds: topBirds.map((row) => ({
        birdName: row.bird_name,
        totalQuantity: row.total_quantity,
        totalRevenue: toNumber(row.total_revenue),
      })),
      revenueByPaymentMethod: revenueByPaymentMethod.map((row) => ({
        paymentMethod: row.payment_method,
        count: row.count,
        revenue: toNumber(row.revenue),
      })),
      statusBreakdown: statusBreakdown.map((row) => ({
        status: row.status,
        count: row.count,
      })),
      lowStockBirds,
    };
  },
};
