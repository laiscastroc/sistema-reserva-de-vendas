import { dashboardService } from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardController = {
  getSummary: asyncHandler(async (req, res) => {
    const { days, lowStockThreshold } = req.query;
    const data = await dashboardService.getSummary({ days, lowStockThreshold });
    res.json(data);
  }),
};
