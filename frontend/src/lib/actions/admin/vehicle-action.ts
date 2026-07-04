"use server";

import { revalidatePath } from "next/cache";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "@/lib/api/admin/vehicle";

// get all vehicles with pagination and search for admin dashboard
export const handleGetAllVehicles = async ({
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

    const result = await getAllVehicles({
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
      message: result.message || "Failed to fetch vehicles",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch vehicles",
    };
  }
};

// get a single vehicle by id for detail and edit pages
export const handleGetVehicleById = async (id: string) => {
  try {
    const result = await getVehicleById(id);
    if (result.success) {
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch vehicle",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch vehicle",
    };
  }
};

// admin creates a new vehicle
export const handleCreateVehicle = async (data: FormData) => {
  try {
    const result = await createVehicle(data);
    if (result.success) {
      revalidatePath("/dashboard/vehicles"); // refresh vehicle list after creation
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Vehicle creation failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Vehicle creation failed",
    };
  }
};

// admin updates a vehicle
export const handleUpdateVehicle = async (id: string, data: FormData) => {
  try {
    const result = await updateVehicle(id, data);
    if (result.success) {
      revalidatePath("/dashboard/vehicles"); // refresh vehicle list after update
      revalidatePath(`/dashboard/vehicles/${id}`); // refresh detail page too
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to update vehicle",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update vehicle",
    };
  }
};

// admin deletes a vehicle - revalidates list page after deletion
export const handleDeleteVehicle = async (id: string) => {
  try {
    const result = await deleteVehicle(id);
    if (result.success) {
      revalidatePath("/dashboard/vehicles"); // refresh vehicle list after deletion
      return { success: true, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Failed to delete vehicle",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete vehicle",
    };
  }
};
