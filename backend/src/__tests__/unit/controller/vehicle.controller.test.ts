import { Request, Response } from "express";
import mongoose from "mongoose";
import { VehicleController } from "../../../controllers/vehicle.controller";
import { VehicleModel } from "../../../models/vehicle.model";
import { BrandModel } from "../../../models/brand.model";
import { CategoryModel } from "../../../models/category.model";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Unit tests for VehicleController - mocks req/res, uses real service and test DB
describe("Unit: VehicleController", () => {
  const vehicleController = new VehicleController();

  let vehicleId: string;

  beforeAll(async () => {
    await VehicleModel.deleteMany({ name: "Controller Test Vehicle 2" });

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
      name: "Controller Test Vehicle 2",
      brandId: brand._id,
      categoryId: category._id,
      pricePerDay: 550,
      fuelType: "Petrol",
      seats: 5,
      transmission: "Manual",
      description: "test vehicle for controller tests",
    });
    vehicleId = vehicle._id.toString();
  });

  afterAll(async () => {
    await VehicleModel.deleteMany({ name: "Controller Test Vehicle 2" });
  });

  describe("getAllVehicles", () => {
    test("should return 200 with a list of vehicles", async () => {
      const req = {} as unknown as Request;
      const res = mockResponse();

      await vehicleController.getAllVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(Array.isArray(jsonArg.data)).toBe(true);
    });
  });

  describe("getVehicleById", () => {
    test("should return 200 with the vehicle", async () => {
      const req = { params: { id: vehicleId } } as unknown as Request;
      const res = mockResponse();

      await vehicleController.getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.data._id.toString()).toBe(vehicleId);
    });

    test("should return 404 for non-existing vehicle id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const req = { params: { id: fakeId } } as unknown as Request;
      const res = mockResponse();

      await vehicleController.getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(false);
    });
  });
});
