import { birdsService } from "../services/birds.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const birdsController = {
  list: asyncHandler(async (req, res) => {
    const birds = await birdsService.getAll({ type: req.query.type });
    res.json(birds);
  }),

  getById: asyncHandler(async (req, res) => {
    const bird = await birdsService.getById(req.params.id);
    res.json(bird);
  }),

  listTypes: asyncHandler(async (req, res) => {
    const types = await birdsService.getTypes();
    res.json(types);
  }),
};
