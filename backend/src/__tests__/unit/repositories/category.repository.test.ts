import mongoose from "mongoose";
import { CategoryMongoRepository } from "../../../repositories/category.repository";
import { CategoryModel } from "../../../models/category.model";

// Unit tests for CategoryMongoRepository
describe("Unit: CategoryMongoRepository", () => {
  const categoryRepository = new CategoryMongoRepository();
  let categoryId: string;

  beforeAll(async () => {
    await CategoryModel.deleteMany({ name: "Van" });
  });

  afterAll(async () => {
    await CategoryModel.deleteMany({ name: "Van" });
  });

  test("should create a category", async () => {
    const category = await categoryRepository.createCategory({
      name: "Van",
      description: "test category for repo tests",
    } as any);

    expect(category).toBeDefined();
    expect(category.name).toBe("Van");
    categoryId = category._id.toString();
  });

  test("should find category by id", async () => {
    const found = await categoryRepository.getCategoryById(categoryId);
    expect(found).toBeDefined();
    expect(found?.name).toBe("Van");
  });

  test("should find category by name", async () => {
    const found = await categoryRepository.getCategoryByName("Van");
    expect(found).toBeDefined();
    expect(found?._id.toString()).toBe(categoryId);
  });

  test("should return null for non-existing category name", async () => {
    const found = await categoryRepository.getCategoryByName(
      "Nonexistent Category" as any,
    );
    expect(found).toBeNull();
  });

  test("should get all categories", async () => {
    const categories = await categoryRepository.getAll();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  test("should update a category", async () => {
    const updated = await categoryRepository.update(categoryId, {
      description: "updated via repository",
    });
    expect(updated?.description).toBe("updated via repository");
  });

  test("should delete a category", async () => {
    const deleted = await categoryRepository.delete(categoryId);
    expect(deleted).toBe(true);
  });

  test("should return null when getting a deleted category by id", async () => {
    const found = await categoryRepository.getCategoryById(categoryId);
    expect(found).toBeNull();
  });
});
