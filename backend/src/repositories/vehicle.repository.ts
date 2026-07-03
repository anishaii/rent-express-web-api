import { VehicleModel, IVehicle } from "../models/vehicle.model";

export interface IVehicleRepository {
  createVehicle(vehicle: Partial<IVehicle>): Promise<IVehicle>;
  getVehicleById(id: string): Promise<IVehicle | null>;
  getAll(): Promise<IVehicle[]>;
  update(id: string, vehicle: Partial<IVehicle>): Promise<IVehicle | null>;
  delete(id: string): Promise<boolean>;
  getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IVehicle[]; total: number }>;
}

export class VehicleMongoRepository implements IVehicleRepository {
  async createVehicle(vehicle: Partial<IVehicle>): Promise<IVehicle> {
    const created = await VehicleModel.create(vehicle);
    return created;
  }

  async getVehicleById(id: string): Promise<IVehicle | null> {
    // populate brand and category so we get full objects not just ids
    const found = await VehicleModel.findById(id)
      .populate("brandId")
      .populate("categoryId");
    return found;
  }

  async getAll(): Promise<IVehicle[]> {
    // populate brand and category for public listing page
    const found = await VehicleModel.find()
      .populate("brandId")
      .populate("categoryId");
    return found;
  }

  async update(
    id: string,
    vehicle: Partial<IVehicle>,
  ): Promise<IVehicle | null> {
    const updated = await VehicleModel.findByIdAndUpdate(id, vehicle, {
      new: true,
    });
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await VehicleModel.findByIdAndDelete(id);
    return !!deleted;
  }

  // search vehicles by name with pagination for admin dashboard
  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IVehicle[]; total: number }> {
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const total = await VehicleModel.countDocuments(filter);
    const data = await VehicleModel.find(filter)
      .populate("brandId")
      .populate("categoryId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { data, total };
  }
}
