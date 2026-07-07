import { salesService } from "../services/sales.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const salesController = {
  create: asyncHandler(async (req, res) => {
    const sale = await salesService.create(req.body);
    res.status(201).json(sale);
  }),

  list: asyncHandler(async (req, res) => {
    const { page, limit, status, bird_id: birdId } = req.query;
    const result = await salesService.list({ page, limit, status, birdId });
    res.json(result);
  }),

  cancel: asyncHandler(async (req, res) => {
    const sale = await salesService.cancelReservation(req.params.id);
    res.json(sale);
  }),
};
