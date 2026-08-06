import { query } from "../config/database.js";

export const birdsRepository = {
  async findAll({ type } = {}) {
    if(type) {
      const result = await query(
        `SELECT id, name, scientific_name, type, price, legalization_price, image_url, stock
         FROM birds
         WHERE type = $1
         ORDER BY name ASC`,
        [type]
      );
      return result.rows;
    }

    const result = await query(
      `SELECT id, name, scientific_name, type, price, legalization_price, image_url, stock
       FROM birds
       ORDER BY name ASC`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await query(
      `SELECT id, name, scientific_name, type, price, legalization_price, image_url, stock
       FROM birds
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async listTypes() {
    const result = await query(
      `SELECT DISTINCT type FROM birds WHERE type IS NOT NULL ORDER BY type ASC`
    );
    return result.rows.map((row) => row.type);
  },
//decrementa o estoque da ave a partir do momento
//que a venda está em "transação"
  async decrementStock(client, birdId, quantity) {
    const { rows } = await client.query(
      `SELECT id, stock FROM birds WHERE id = $1 FOR UPDATE`,
      [birdId]
    );
    const bird = rows[0];

    if(!bird) return null;
    if(bird.stock !== null && bird.stock < quantity) {
      return { insufficientStock: true, available: bird.stock };
    }

    if(bird.stock !== null) {
      await client.query(`UPDATE birds SET stock = stock - $1 WHERE id = $2`, [quantity, birdId]);
    }
    return { ok: true };
  },

  async incrementStock(client, birdId, quantity) {
    await client.query(
      `UPDATE birds SET stock = stock + $1 WHERE id = $2 AND stock IS NOT NULL`,
      [quantity, birdId]
    );
  },
};
