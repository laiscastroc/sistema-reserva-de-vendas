import { query } from "../config/database.js";

export const dashboardRepository = {
    async getSummary() {
       const result = await query(
        `SELECT
        COUNT(*) FILTER (WHERE status = 'VENDA')::int AS total_sales,
        COUNT(*) FILTER (WHERE status = 'RESERVA')::int AS total_reservations,
        COUNT(*) FILTER (WHERE status = 'CANCELADA')::int AS total_cancelled,
        COALESCE(SUM(total_price) FILTER (WHERE status = 'VENDA'), 0) AS total_revenue,
        COALESCE(SUM(legalization_total) FILTER (WHERE status = 'VENDA'), 0) AS total_legalization_revenue,
        COALESCE(AVG(total_price) FILTER (WHERE status = 'VENDA'), 0) AS average_ticket,
        COALESCE(SUM(quantity) FILTER (WHERE status = 'VENDA'), 0)::int AS birds_sold
        FROM sales`
       )
       return result.rows[0]
    },
    //para quando tiver dias sem vendas o gráfico 
    //não ficar "estranho"
    async getRevenueByDay(days) {
        const result = await query(
            `SELECT
         d::date AS day,
         COALESCE(SUM(s.total_price), 0) AS revenue,
         COUNT(s.id)::int AS sales_count
       FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') AS d
       LEFT JOIN sales s
         ON DATE(s.created_at) = d::date AND s.status = 'VENDA'
       GROUP BY d
       ORDER BY d ASC`,
      [days]
    );
        return result.rows;
    },

    async getTopBirds(limit) {
    const result = await query(
      `SELECT
         bird_name,
         SUM(quantity)::int AS total_quantity,
         SUM(total_price) AS total_revenue
       FROM sales
       WHERE status = 'VENDA'
       GROUP BY bird_name
       ORDER BY total_revenue DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

    async getRevenueByPaymentMethod() {
    const result = await query(
      `SELECT
         payment_method,
         COUNT(*)::int AS count,
         SUM(total_price) AS revenue
       FROM sales
       WHERE status = 'VENDA'
       GROUP BY payment_method
       ORDER BY revenue DESC`
    );
    return result.rows;
  },

  async getStatusBreakdown() {
    const result = await query(
      `SELECT status, COUNT(*)::int AS count
       FROM sales
       GROUP BY status`
    );
    return result.rows;
  },

  async getLowStockBirds(threshold) {
    const result = await query(
      `SELECT id, name, stock
       FROM birds
       WHERE stock <= $1
       ORDER BY stock ASC`,
      [threshold]
    );
    return result.rows;
  },
};