import { withTransaction } from "../config/database.js";
import { birdsRepository } from "../repositories/birds.repository.js";
import { salesRepository } from "../repositories/sales.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { maskSaleRecord } from "../utils/mask.js";

export const salesService = {
  async create(payload) {
    return withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT id, name, price, legalization_price, stock FROM birds WHERE id = $1 FOR UPDATE`,
        [payload.bird_id]
      );
      const bird = rows[0];

      if(!bird) {
        throw ApiError.notFound("Ave não encontrada");
      }

      const stockResult = await birdsRepository.decrementStock(client, bird.id, payload.quantity);
      if (stockResult?.insufficientStock) {
        throw ApiError.conflict(
          `Estoque insuficiente. Disponível: ${stockResult.available} unidade(s).`
        );
      }

      const unitPrice = Number(bird.price);
      const legalizationTotal = payload.include_legalization
        ? Number(bird.legalization_price) * payload.quantity
        : 0;
      const totalPrice = unitPrice * payload.quantity + legalizationTotal;

      const sale = await salesRepository.create(client, {
        bird_id: bird.id,
        bird_name: bird.name,
        gender: payload.gender,
        quantity: payload.quantity,
        buyer_name: payload.buyer_name,
        cpf: payload.cpf,
        contact: payload.contact,
        payment_method: payload.payment_method,
        status: payload.status,
        unit_price: unitPrice,
        legalization_total: legalizationTotal,
        total_price: totalPrice,
      });
      return sale;
    });
  },
  async list({ page, limit, status, birdId }) {
    const { rows, total } = await salesRepository.findAndCount({ page, limit, status, birdId });
    return {
      data: rows.map(maskSaleRecord),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  },

  async cancelReservation(id) {
    return withTransaction(async (client) => {
      const { rows } = await client.query(`SELECT * FROM sales WHERE id = $1 FOR UPDATE`, [id]);
      const sale = rows[0];

      if(!sale) {
        throw ApiError.notFound("Registro não encontrado");
      }
      if(sale.status !== "RESERVA") {
        throw ApiError.conflict("Somente reservas podem ser canceladas");
      }

      await birdsRepository.incrementStock(client, sale.bird_id, sale.quantity);
      const updated = await salesRepository.updateStatus(client, id, "CANCELADA");
      return maskSaleRecord(updated);
    });
  },
};
