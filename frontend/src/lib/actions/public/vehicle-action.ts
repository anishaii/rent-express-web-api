"use server";

import {
  getPublicVehicles,
  getPublicVehicleById,
} from "@/lib/api/public/vehicle";

// get all vehicles for public listing and homepage
export const handleGetPublicVehicles = async () => {
  try {
    const result = await getPublicVehicles();
    if (result.success) {
      return { success: true, data: result.data };
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

// get single vehicle by id for detail page
export const handleGetPublicVehicleById = async (id: string) => {
  try {
    const result = await getPublicVehicleById(id);
    if (result.success) {
      return { success: true, data: result.data };
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
