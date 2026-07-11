import request from "supertest";
import app from "../../app";
import { VehicleModel } from "../../models/vehicle.model";
import { BrandModel } from "../../models/brand.model";
import { CategoryModel } from "../../models/category.model";

// Integration tests for the Vehicle API (public routes)
describe("Vehicle API Integration Tests", () => {
  let vehicleId: string;

  beforeAll(async () => {
    await VehicleModel.deleteMany({ name: "Integration Test Vehicle 2" });

    const brand = await BrandModel.findOneAndUpdate(
      { name: "Test Brand" },
      { name: "Test Brand" },
      { upsert: true, new: true },
    );
    const category = await CategoryModel.findOneAndUpdate(
      { name: "Car" },
      { name: "Car", description: "test category" },
      { upsert: true, new: true },
    );

    const vehicle = await VehicleModel.create({
      name: "Integration Test Vehicle 2",
      brandId: brand._id,
      categoryId: category._id,
      pricePerDay: 750,
      fuelType: "Petrol",
      seats: 5,
      transmission: "Manual",
      description: "test vehicle for vehicle integration tests",
    });
    vehicleId = vehicle._id.toString();
  });

  afterAll(async () => {
    await VehicleModel.deleteMany({ name: "Integration Test Vehicle 2" });
  });

  describe("GET /api/vehicle", () => {
    test("should return all vehicles without auth", async () => {
      const res = await request(app).get("/api/vehicle");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/vehicle/:id", () => {
    test("should return a single vehicle by id", async () => {
      const res = await request(app).get(`/api/vehicle/${vehicleId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(vehicleId);
      expect(res.body.data.name).toBe("Integration Test Vehicle 2");
    });

    test("should return 404 for non-existing vehicle id", async () => {
      const fakeId = "aaaaaaaaaaaaaaaaaaaaaaaa";
      const res = await request(app).get(`/api/vehicle/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
