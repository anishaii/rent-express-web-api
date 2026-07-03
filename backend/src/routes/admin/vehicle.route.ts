import { Router } from "express";
import { VehicleController } from "../../controllers/admin/vehicle.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const adminVehicleRoute = Router();
const vehicleController = new VehicleController();

// admin only - get all vehicles with pagination and search
adminVehicleRoute.get(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  vehicleController.getAllVehiclesPaginated,
);

// admin only - get single vehicle by id
adminVehicleRoute.get(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  vehicleController.getVehicleById,
);

// admin only - create vehicle with optional image upload
adminVehicleRoute.post(
  "/create",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("vehicleImage"),
  vehicleController.createVehicle,
);

// admin only - update vehicle
adminVehicleRoute.put(
  "/update/:id",
  authorizedMiddleware,
  adminMiddleware,
  uploads.single("vehicleImage"),
  vehicleController.updateVehicle,
);

// admin only - delete vehicle
adminVehicleRoute.delete(
  "/delete/:id",
  authorizedMiddleware,
  adminMiddleware,
  vehicleController.deleteVehicle,
);

export default adminVehicleRoute;
