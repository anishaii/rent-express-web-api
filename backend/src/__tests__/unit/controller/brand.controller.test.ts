import { Request, Response } from "express";
import mongoose from "mongoose";
import { BrandController } from "../../../controllers/admin/brand.controller";
import { BrandModel } from "../../../models/brand.model";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Unit tests for BrandController - mocks req/res, uses real service and test DB
describe("Unit: BrandController", () => {
  const brandController = new BrandController();
  let brandId: string;

  beforeAll(async () => {
    await BrandModel.deleteMany({ name: "Test Controller Brand" });
  });

  afterAll(async () => {
    await BrandModel.deleteMany({ name: "Test Controller Brand" });
  });

  describe("getAllBrands", () => {
    test("should return 200 with a list of brands", async () => {
      const req = {} as unknown as Request;
      const res = mockResponse();

      await brandController.getAllBrands(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(Array.isArray(jsonArg.data)).toBe(true);
    });
  });

  describe("createBrand", () => {
    test("should return 200 and create a brand", async () => {
      const req = {
        body: { name: "Test Controller Brand" },
        file: undefined,
      } as unknown as Request;
      const res = mockResponse();

      await brandController.createBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.data.name).toBe("Test Controller Brand");
      brandId = jsonArg.data._id.toString();
    });

    test("should return 400 for invalid brand data", async () => {
      const req = {
        body: {}, // missing required name field
        file: undefined,
      } as unknown as Request;
      const res = mockResponse();

      await brandController.createBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(false);
    });
  });

  describe("updateBrand", () => {
    test("should return 200 and update the brand", async () => {
      const req = {
        params: { id: brandId },
        body: { name: "Test Controller Brand Updated" },
        file: undefined,
      } as unknown as Request;
      const res = mockResponse();

      await brandController.updateBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.data.name).toBe("Test Controller Brand Updated");
    });

    test("should return 404 for non-existing brand id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const req = {
        params: { id: fakeId },
        body: { name: "Doesn't Matter" },
        file: undefined,
      } as unknown as Request;
      const res = mockResponse();

      await brandController.updateBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteBrand", () => {
    test("should return 200 when deleting the brand", async () => {
      const req = { params: { id: brandId } } as unknown as Request;
      const res = mockResponse();

      await brandController.deleteBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(true);
    });
  });
});
