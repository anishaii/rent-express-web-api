import mongoose from "mongoose";
import { VehicleMongoRepository } from "../../../repositories/vehicle.repository";
import { VehicleModel } from "../../../models/vehicle.model";
import { BrandModel } from "../../../models/brand.model";
import { CategoryModel } from "../../../models/category.model";

// Unit tests for VehicleMongoRepository
describe("Unit: VehicleMongoRepository", () => {
  const vehicleRepository = new VehicleMongoRepository();

  let brandId: string;
  let categoryId: string;
  let vehicleId: string;

  beforeAll(async () => {
    await VehicleModel.deleteMany({
      name: { $in: ["Repo Test Vehicle 2", "Repo Test Vehicle 2 Updated"] },
    });

    const brand = await BrandModel.findOneAndUpdate(
      { name: "Test Brand" },
      { name: "Test Brand" },
      { upsert: true, new: true },
    );
    brandId = brand._id.toString();

    const category = await CategoryModel.findOneAndUpdate(
      { name: "Car" },
      { name: "Car", description: "test category" },
      { upsert: true, new: true },
    );
    categoryId = category._id.toString();
  });

  afterAll(async () => {
    await VehicleModel.deleteMany({
      name: { $in: ["Repo Test Vehicle 2", "Repo Test Vehicle 2 Updated"] },
    });
  });

  test("should create a vehicle", async () => {
    const vehicle = await vehicleRepository.createVehicle({
      name: "Repo Test Vehicle 2",
      brandId,
      categoryId,
      pricePerDay: 900,
      fuelType: "Diesel",
      seats: 7,
      transmission: "Automatic",
      description: "test vehicle for repo tests",
    } as any);

    expect(vehicle).toBeDefined();
    expect(vehicle.name).toBe("Repo Test Vehicle 2");
    vehicleId = vehicle._id.toString();
  });

  test("should find vehicle by id with populated brand and category", async () => {
    const found = await vehicleRepository.getVehicleById(vehicleId);
    expect(found).toBeDefined();
    expect((found as any).brandId.name).toBe("Test Brand");
    expect((found as any).categoryId.name).toBe("Car");
  });

  test("should return null for non-existing vehicle id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await vehicleRepository.getVehicleById(fakeId);
    expect(found).toBeNull();
  });

  test("should get all vehicles", async () => {
    const vehicles = await vehicleRepository.getAll();
    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBeGreaterThan(0);
  });

  test("should update a vehicle", async () => {
    const updated = await vehicleRepository.update(vehicleId, {
      name: "Repo Test Vehicle 2 Updated",
    });
    expect(updated?.name).toBe("Repo Test Vehicle 2 Updated");
  });

  test("should get paginated vehicles with search filter", async () => {
    const result = await vehicleRepository.getAllPaginated(1, 10, "Updated");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test("should delete a vehicle", async () => {
    const deleted = await vehicleRepository.delete(vehicleId);
    expect(deleted).toBe(true);
  });
});
