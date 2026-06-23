import { Router } from "express";
import { BrandController } from "../../controllers/admin/brand.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const adminBrandRoute = Router();
const brandController = new BrandController();

// admin only - create brand with optional logo upload
adminBrandRoute.post(
  "/create",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("logoImage"), // multer handles logo upload
  brandController.createBrand,
);

// admin only - update brand
adminBrandRoute.put(
  "/update/:id",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("logoImage"),
  brandController.updateBrand,
);

// admin only - delete brand
adminBrandRoute.delete(
  "/delete/:id",
  authorizedMiddleware,
  adminMiddleware,
  brandController.deleteBrand,
);

export default adminBrandRoute;
