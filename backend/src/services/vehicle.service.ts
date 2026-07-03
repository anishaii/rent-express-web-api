import { VehicleMongoRepository } from "../repositories/vehicle.repository";
import { CreateVehicleDTO, UpdateVehicleDTO } from "../dtos/vehicle.dto";
import { IVehicle } from "../models/vehicle.model";
import { HttpException } from "../exceptions/http-exception";

const vehicleRepository = new VehicleMongoRepository();

export class VehicleService {
  // get all vehicles for the public listing page
  async getAllVehicles(): Promise<IVehicle[]> {
    const vehicles = await vehicleRepository.getAll();
    return vehicles;
  }

  // get a single vehicle by id for the detail page
  async getVehicleById(id: string): Promise<IVehicle> {
    const vehicle = await vehicleRepository.getVehicleById(id);
    if (!vehicle) {
      throw new HttpException(404, "Vehicle not found");
    }
    return vehicle;
  }

  async createVehicle(
    data: CreateVehicleDTO,
    imageUrl?: string,
  ): Promise<IVehicle> {
    const vehicle = await vehicleRepository.createVehicle(
      { ...data, imageUrl } as unknown as Partial<IVehicle>, // brandId/categoryId are valid ObjectId strings at runtime
    );
    return vehicle;
  }

  async updateVehicle(
    id: string,
    data: UpdateVehicleDTO,
    imageUrl?: string,
  ): Promise<IVehicle> {
    const existing = await vehicleRepository.getVehicleById(id);
    if (!existing) {
      throw new HttpException(404, "Vehicle not found");
    }

    // only update imageUrl if a new image was uploaded
    const updateData = imageUrl ? { ...data, imageUrl } : data;

    const updated = await vehicleRepository.update(
      id,
      updateData as unknown as Partial<IVehicle>, // brandId/categoryId come as strings from request
    );
    return updated!;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const existing = await vehicleRepository.getVehicleById(id);
    if (!existing) {
      throw new HttpException(404, "Vehicle not found");
    }
    return await vehicleRepository.delete(id);
  }

  // get paginated vehicles with optional search for admin dashboard
  async getAllVehiclesPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IVehicle[]; total: number }> {
    return await vehicleRepository.getAllPaginated(page, limit, search);
  }
}
