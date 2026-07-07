import { query } from "../config/database.js";

export const salesRepository = {
  async create(client, sale) {
    const result = await client.query(
      `INSERT INTO sales
        (bird_id, bird_name, gender, quantity, buyer_name, cpf, contact,
         payment_method, status, unit_price, legalization_total, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        sale.bird_id,
        sale.bird_name,
        sale.gender,
        sale.quantity,
        sale.buyer_name,
        sale.cpf,
        sale.contact,
        sale.payment_method,
        sale.status,
        sale.unit_price,
        sale.legalization_total,
        sale.total_price,
      ]
    );
    return result.rows[0];
  },

  async findAndCount({ page, limit, status, birdId }) {
    const conditions = [];
    const params = [];

    if(status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if(birdId) {
      params.push(birdId);
      conditions.push(`bird_id = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query(`SELECT COUNT(*)::int AS total FROM sales ${where}`, params);
    const total = countResult.rows[0].total;

    const offset = (page - 1) * limit;
    const dataParams = [...params, limit, offset];
    const dataResult = await query(
      `SELECT * FROM sales ${where}
       ORDER BY created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    return { rows: dataResult.rows, total };
  },

  async findById(id){
    const result = await query(`SELECT * FROM sales WHERE id = $1`, [id]);
    return result.rows[0] ?? null;
  },

  async updateStatus(client, id, status){
    const result = await client.query(
      `UPDATE sales SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] ?? null;
  },
};
