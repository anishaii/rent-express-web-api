import { Request, Response } from "express";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { VehicleService } from "../services/vehicle.service";

const vehicleService = new VehicleService();

export class VehicleController {
  // public - anyone can view all vehicles
  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles = await vehicleService.getAllVehicles();
      return ApiResponseHelper.success(
        res,
        vehicles,
        "Vehicles fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // public - anyone can view a single vehicle detail
  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const vehicle = await vehicleService.getVehicleById(id);
      return ApiResponseHelper.success(
        res,
        vehicle,
        "Vehicle fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
