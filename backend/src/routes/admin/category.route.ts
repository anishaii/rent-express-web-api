import { Router } from "express";
import { CategoryController } from "../../controllers/admin/category.controller";
import {
  adminMiddleware,
  authorizedMiddleware,
} from "../../middlewares/authorized.middleware";

const adminCategoryRoute = Router();
const categoryController = new CategoryController();

adminCategoryRoute.post(
  "/create",
  authorizedMiddleware,
  adminMiddleware,
  categoryController.createCategory,
);
adminCategoryRoute.put(
  "/update/:id",
  authorizedMiddleware,
  adminMiddleware,
  categoryController.updateCategory,
);
adminCategoryRoute.delete(
  "/delete/:id",
  authorizedMiddleware,
  adminMiddleware,
  categoryController.deleteCategory,
);

export default adminCategoryRoute;
