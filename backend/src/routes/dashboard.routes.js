import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { validate } from "../middlewares/validate.js";
import { dashboardQuerySchema } from "../validators/dashboard.validator.js";

const router = Router();

router.get("/summary", validate(dashboardQuerySchema, "query"), dashboardController.getSummary);

export default router;
