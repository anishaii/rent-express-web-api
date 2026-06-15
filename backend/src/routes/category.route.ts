import { Router } from "express";
import { CategoryController } from "../controllers/admin/category.controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

// Public - anyone can view categories
categoryRouter.get("/", categoryController.getAllCategories);

export default categoryRouter;
