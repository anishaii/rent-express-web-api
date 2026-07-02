"use server";

import { revalidatePath } from "next/cache";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/admin/category";

// get all categories for admin dashboard
export const handleGetAllCategories = async () => {
  try {
    const result = await getAllCategories();
    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch categories",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch categories",
    };
  }
};

// admin creates a new category
export const handleCreateCategory = async (data: {
  name: string;
  description: string;
}) => {
  try {
    const result = await createCategory(data);
    if (result.success) {
      revalidatePath("/dashboard/categories"); // refresh category list after creation
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Category creation failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Category creation failed",
    };
  }
};

// admin updates a category
export const handleUpdateCategory = async (
  id: string,
  data: { name?: string; description?: string },
) => {
  try {
    const result = await updateCategory(id, data);
    if (result.success) {
      revalidatePath("/dashboard/categories"); // refresh category list after update
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to update category",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update category",
    };
  }
};

// admin deletes a category - revalidates list page after deletion
export const handleDeleteCategory = async (id: string) => {
  try {
    const result = await deleteCategory(id);
    if (result.success) {
      revalidatePath("/dashboard/categories"); // refresh category list after deletion
      return { success: true, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Failed to delete category",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete category",
    };
  }
};
