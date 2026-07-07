import { Router } from "express";
import birdsRoutes from "./birds.routes.js";
import salesRoutes from "./sales.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/birds", birdsRoutes);
router.use("/sales", salesRoutes);

export default router;
