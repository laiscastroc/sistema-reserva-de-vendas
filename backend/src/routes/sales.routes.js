import { Router } from "express";
import { salesController } from "../controllers/sales.controller.js";
import { validate } from "../middlewares/validate.js";
import { createSaleLimiter } from "../middlewares/rateLimiter.js";
import { createSaleSchema, listSalesQuerySchema, idParamSchema } from "../validators/sale.validator.js";

const router = Router();

router.get("/", validate(listSalesQuerySchema, "query"), salesController.list);

router.post(
  "/",
  createSaleLimiter,
  validate(createSaleSchema, "body"),
  salesController.create
);

router.patch(
  "/:id/cancel",
  validate(idParamSchema, "params"),
  salesController.cancel
);

export default router;
