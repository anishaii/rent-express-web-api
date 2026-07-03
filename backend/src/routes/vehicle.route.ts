import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";

const vehicleRouter = Router();
const vehicleController = new VehicleController();

// public - anyone can view all vehicles
vehicleRouter.get("/", vehicleController.getAllVehicles);

// public - anyone can view a single vehicle detail
vehicleRouter.get("/:id", vehicleController.getVehicleById);

export default vehicleRouter;
