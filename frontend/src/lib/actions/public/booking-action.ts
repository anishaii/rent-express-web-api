"use server";

import { revalidatePath } from "next/cache";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from "@/lib/api/public/booking";

// create a new booking for logged in user
export const handleCreateBooking = async (data: {
  vehicleId: string;
  startDate: string;
  endDate: string;
}) => {
  try {
    const result = await createBooking(data);
    if (result.success) {
      revalidatePath("/bookings"); // refresh bookings page after creation
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Booking failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Booking failed",
    };
  }
};

// get all bookings for logged in user
export const handleGetMyBookings = async () => {
  try {
    const result = await getMyBookings();
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch bookings",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch bookings",
    };
  }
};

// get single booking by id
export const handleGetBookingById = async (id: string) => {
  try {
    const result = await getBookingById(id);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch booking",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch booking",
    };
  }
};

// cancel a pending booking
export const handleCancelBooking = async (id: string) => {
  try {
    const result = await cancelBooking(id);
    if (result.success) {
      revalidatePath("/bookings"); // refresh bookings page after cancellation
      return { success: true, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Failed to cancel booking",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to cancel booking",
    };
  }
};
