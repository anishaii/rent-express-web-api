"use server";

import { revalidatePath } from "next/cache";
import {
  addFavourite,
  getMyFavourites,
  checkFavourite,
  removeFavourite,
} from "@/lib/api/public/favourite";

// add vehicle to favourites
export const handleAddFavourite = async (vehicleId: string) => {
  try {
    const result = await addFavourite(vehicleId);
    if (result.success) {
      revalidatePath("/favourites");
      return { success: true, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Failed to add favourite",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to add favourite",
    };
  }
};

// get all favourites for logged in user
export const handleGetMyFavourites = async () => {
  try {
    const result = await getMyFavourites();
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch favourites",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch favourites",
    };
  }
};

// check if vehicle is in favourites
export const handleCheckFavourite = async (vehicleId: string) => {
  try {
    const result = await checkFavourite(vehicleId);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to check favourite",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to check favourite",
    };
  }
};

// remove vehicle from favourites
export const handleRemoveFavourite = async (vehicleId: string) => {
  try {
    const result = await removeFavourite(vehicleId);
    if (result.success) {
      revalidatePath("/favourites");
      return { success: true, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Failed to remove favourite",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to remove favourite",
    };
  }
};
