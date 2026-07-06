import { Router } from "express";

import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";

import { DashboardController } from "../../controllers/admin/dasboard.controller";

const adminDashboardRoute = Router();
const dashboardController = new DashboardController();

// admin only - get all dashboard stats
adminDashboardRoute.get(
  "/stats",
  authorizedMiddleware,
  adminMiddleware,
  dashboardController.getStats,
);

export default adminDashboardRoute;
