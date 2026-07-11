import mongoose from "mongoose";
import { BrandService } from "../../../services/brand.service";
import { BrandModel } from "../../../models/brand.model";

// Unit tests for BrandService
describe("Unit: BrandService", () => {
  const brandService = new BrandService();
  let brandId: string;

  beforeAll(async () => {
    await BrandModel.deleteMany({ name: "Test Service Brand" });
  });

  afterAll(async () => {
    await BrandModel.deleteMany({ name: "Test Service Brand" });
  });

  test("should create a brand", async () => {
    const brand = await brandService.createBrand({
      name: "Test Service Brand",
    } as any);

    expect(brand).toBeDefined();
    expect(brand.name).toBe("Test Service Brand");
    brandId = brand._id.toString();
  });

  test("should throw error when creating a duplicate brand name", async () => {
    await expect(
      brandService.createBrand({ name: "Test Service Brand" } as any),
    ).rejects.toThrow('Brand "Test Service Brand" already exists');
  });

  test("should get all brands", async () => {
    const brands = await brandService.getAllBrands();
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
  });

  test("should update a brand", async () => {
    const updated = await brandService.updateBrand(brandId, {
      name: "Test Service Brand Updated",
    } as any);
    expect(updated.name).toBe("Test Service Brand Updated");
  });

  test("should throw 404 when updating non-existing brand", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(
      brandService.updateBrand(fakeId, { name: "Doesn't Matter" } as any),
    ).rejects.toThrow("Brand not found");
  });

  test("should get paginated brands with search filter", async () => {
    const result = await brandService.getAllBrandsPaginated(1, 10, "Updated");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].name).toContain("Updated");
  });

  test("should delete a brand", async () => {
    const deleted = await brandService.deleteBrand(brandId);
    expect(deleted).toBe(true);
  });

  test("should throw 404 when deleting non-existing brand", async () => {
    await expect(brandService.deleteBrand(brandId)).rejects.toThrow(
      "Brand not found",
    );
  });
});
