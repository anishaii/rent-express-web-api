import mongoose from "mongoose";
import { BrandMongoRepository } from "../../../repositories/brand.repository";
import { BrandModel } from "../../../models/brand.model";

// Unit tests for BrandMongoRepository
describe("Unit: BrandMongoRepository", () => {
  const brandRepository = new BrandMongoRepository();
  let brandId: string;

  beforeAll(async () => {
    await BrandModel.deleteMany({ name: "Test Repo Brand" });
  });

  afterAll(async () => {
    await BrandModel.deleteMany({ name: "Test Repo Brand" });
  });

  test("should create a brand", async () => {
    const brand = await brandRepository.createBrand({
      name: "Test Repo Brand",
    });

    expect(brand).toBeDefined();
    expect(brand.name).toBe("Test Repo Brand");
    brandId = brand._id.toString();
  });

  test("should find brand by id", async () => {
    const found = await brandRepository.getBrandById(brandId);
    expect(found).toBeDefined();
    expect(found?.name).toBe("Test Repo Brand");
  });

  test("should find brand by name", async () => {
    const found = await brandRepository.getBrandByName("Test Repo Brand");
    expect(found).toBeDefined();
    expect(found?._id.toString()).toBe(brandId);
  });

  test("should return null for non-existing brand name", async () => {
    const found = await brandRepository.getBrandByName("Nonexistent Brand XYZ");
    expect(found).toBeNull();
  });

  test("should get all brands", async () => {
    const brands = await brandRepository.getAll();
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
  });

  test("should update a brand", async () => {
    const updated = await brandRepository.update(brandId, {
      name: "Test Repo Brand Updated",
    });
    expect(updated?.name).toBe("Test Repo Brand Updated");
  });

  test("should get paginated brands with search filter", async () => {
    const result = await brandRepository.getAllPaginated(1, 10, "Updated");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test("should delete a brand", async () => {
    const deleted = await brandRepository.delete(brandId);
    expect(deleted).toBe(true);
  });
});
