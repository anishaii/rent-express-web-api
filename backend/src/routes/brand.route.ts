// public route - anyone can view brands
import { Router } from "express";
import { BrandController } from "../controllers/admin/brand.controller";

const brandRouter = Router();
const brandController = new BrandController();

// public - anyone can view all brands
brandRouter.get("/", brandController.getAllBrands);

export default brandRouter;
