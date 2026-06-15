import { CategoryService } from "../../services/category.service";
import { z } from "zod";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../../dtos/category.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { Request, Response } from "express";

const categoryService = new CategoryService();

export class CategoryController {
  // Get all categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();
      return ApiResponseHelper.success(
        res,
        categories,
        "Categories fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // Create a new category
  async createCategory(req: Request, res: Response) {
    try {
      const categoryData = CreateCategoryDTO.safeParse(req.body);
      if (!categoryData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(categoryData.error),
          400,
        );
      }
      const category = await categoryService.createCategory(categoryData.data);
      return ApiResponseHelper.success(
        res,
        category,
        "Category created successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // Update category by ID
  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const categoryData = UpdateCategoryDTO.safeParse(req.body);
      if (!categoryData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(categoryData.error),
          400,
        );
      }
      const category = await categoryService.updateCategory(
        id,
        categoryData.data,
      );
      return ApiResponseHelper.success(
        res,
        category,
        "Category updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // Delete category by ID
  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await categoryService.deleteCategory(id);
      return ApiResponseHelper.success(
        res,
        null,
        "Category deleted successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
