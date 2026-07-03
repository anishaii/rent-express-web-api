import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { CreateVehicleDTO, UpdateVehicleDTO } from "../../dtos/vehicle.dto";
import { VehicleService } from "../../services/vehicle.service";

const vehicleService = new VehicleService();

export class VehicleController {
  // admin - get all vehicles with pagination and search
  async getAllVehiclesPaginated(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await vehicleService.getAllVehiclesPaginated(
        page,
        limit,
        search,
      );

      return ApiResponseHelper.success(
        res,
        {
          data: result.data,
          pagination: {
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit),
          },
        },
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

  // admin - get single vehicle by id
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

  // admin only - create vehicle with optional image upload
  async createVehicle(req: Request, res: Response) {
    try {
      const vehicleData = CreateVehicleDTO.safeParse({
        ...req.body,
        // convert string values from form-data to correct types
        pricePerDay: parseFloat(req.body.pricePerDay),
        seats: parseInt(req.body.seats),
        isAvailable: req.body.isAvailable === "true",
      });

      if (!vehicleData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(vehicleData.error),
          400,
        );
      }

      // get image filename from multer if image was uploaded
      const imageUrl = req.file?.filename
        ? "/uploads/" + req.file.filename
        : undefined;

      const vehicle = await vehicleService.createVehicle(
        vehicleData.data,
        imageUrl,
      );
      return ApiResponseHelper.success(
        res,
        vehicle,
        "Vehicle created successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // admin only - update vehicle details or image
  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      const vehicleData = UpdateVehicleDTO.safeParse({
        ...req.body,
        // convert string values from form-data to correct types if present
        ...(req.body.pricePerDay && {
          pricePerDay: parseFloat(req.body.pricePerDay),
        }),
        ...(req.body.seats && { seats: parseInt(req.body.seats) }),
        ...(req.body.isAvailable !== undefined && {
          isAvailable: req.body.isAvailable === "true",
        }),
      });

      if (!vehicleData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(vehicleData.error),
          400,
        );
      }

      const imageUrl = req.file?.filename
        ? "/uploads/" + req.file.filename
        : undefined;

      const vehicle = await vehicleService.updateVehicle(
        id,
        vehicleData.data,
        imageUrl,
      );
      return ApiResponseHelper.success(
        res,
        vehicle,
        "Vehicle updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // admin only - delete vehicle by id
  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await vehicleService.deleteVehicle(id);
      return ApiResponseHelper.success(
        res,
        null,
        "Vehicle deleted successfully",
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
