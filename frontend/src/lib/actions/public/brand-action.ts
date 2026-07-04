"use server";

import { getPublicBrands } from "@/lib/api/public/brand";

// fetch all brands for dropdowns in vehicle form
export const handleGetPublicBrands = async () => {
  try {
    const result = await getPublicBrands();
    if (result.success) {
      return { success: true, data: result.data };
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
