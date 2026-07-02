"use server";

import { revalidatePath } from "next/cache";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/lib/api/admin/brand";

// get all brands with pagination and search for admin dashboard
export const handleGetAllBrands = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const currentPage = page && page > 0 ? page : 1;
    const currentLimit = limit && limit > 0 ? limit : 10;
    const currentSearch = search || "";

    const result = await getAllBrands({
      page: currentPage,
      limit: currentLimit,
      search: currentSearch,
    });

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data.data,
        pagination: result.data.pagination,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch brands",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch brands",
    };
  }
};

// admin creates a new brand
export const handleCreateBrand = async (data: FormData) => {
  try {
    const result = await createBrand(data);
    if (result.success) {
      revalidatePath("/dashboard/brands"); // refresh brand list after creation
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Brand creation failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Brand creation failed",
    };
  }
};

// admin updates a brand
export const handleUpdateBrand = async (id: string, data: FormData) => {
  try {
    const result = await updateBrand(id, data);
    if (result.success) {
      revalidatePath("/dashboard/brands"); // refresh brand list after update
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to update brand",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update brand",
    };
  }
};

// admin deletes a brand - revalidates list page after deletion
export const handleDeleteBrand = async (id: string) => {
  try {
    const result = await deleteBrand(id);
    if (result.success) {
      revalidatePath("/dashboard/brands"); // refresh brand list after deletion
      return { success: true, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Failed to delete brand",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete brand",
    };
  }
};
