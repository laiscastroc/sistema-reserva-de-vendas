import { Router } from "express";
import { birdsController } from "../controllers/birds.controller.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validators/sale.validator.js";

const router = Router();

router.get("/", birdsController.list);
router.get("/types", birdsController.listTypes);
router.get("/:id", validate(idParamSchema, "params"), birdsController.getById);

export default router;
