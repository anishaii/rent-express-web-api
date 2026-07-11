import mongoose from "mongoose";
import { VehicleService } from "../../../services/vehicle.service";
import { VehicleModel } from "../../../models/vehicle.model";
import { BrandModel } from "../../../models/brand.model";
import { CategoryModel } from "../../../models/category.model";

// Unit tests for VehicleService
describe("Unit: VehicleService", () => {
  const vehicleService = new VehicleService();

  let brandId: string;
  let categoryId: string;
  let vehicleId: string;

  beforeAll(async () => {
    await VehicleModel.deleteMany({
      name: { $in: ["Service Test Vehicle", "Service Test Vehicle Updated"] },
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
      name: { $in: ["Service Test Vehicle", "Service Test Vehicle Updated"] },
    });
  });

  test("should create a vehicle", async () => {
    const vehicle = await vehicleService.createVehicle({
      name: "Service Test Vehicle",
      brandId,
      categoryId,
      pricePerDay: 700,
      fuelType: "Petrol",
      seats: 5,
      transmission: "Manual",
      description: "test vehicle",
    } as any);

    expect(vehicle).toBeDefined();
    expect(vehicle.name).toBe("Service Test Vehicle");
    vehicleId = vehicle._id.toString();
  });

  test("should get all vehicles", async () => {
    const vehicles = await vehicleService.getAllVehicles();
    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBeGreaterThan(0);
  });

  test("should get a vehicle by id", async () => {
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    expect(vehicle).toBeDefined();
    expect(vehicle.name).toBe("Service Test Vehicle");
  });

  test("should throw 404 for non-existing vehicle id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(vehicleService.getVehicleById(fakeId)).rejects.toThrow(
      "Vehicle not found",
    );
  });

  test("should update a vehicle", async () => {
    const updated = await vehicleService.updateVehicle(vehicleId, {
      name: "Service Test Vehicle Updated",
    } as any);
    expect(updated.name).toBe("Service Test Vehicle Updated");
  });

  test("should throw 404 when updating non-existing vehicle", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(
      vehicleService.updateVehicle(fakeId, { name: "Doesn't Matter" } as any),
    ).rejects.toThrow("Vehicle not found");
  });

  test("should get paginated vehicles with search filter", async () => {
    const result = await vehicleService.getAllVehiclesPaginated(
      1,
      10,
      "Updated",
    );
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].name).toContain("Updated");
  });

  test("should delete a vehicle", async () => {
    const deleted = await vehicleService.deleteVehicle(vehicleId);
    expect(deleted).toBe(true);
  });

  test("should throw 404 when deleting non-existing vehicle", async () => {
    await expect(vehicleService.deleteVehicle(vehicleId)).rejects.toThrow(
      "Vehicle not found",
    );
  });
});
