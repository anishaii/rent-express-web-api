"use server";

import { revalidatePath } from "next/cache";
import {
  getAllBookings,
  getBookingById,
  confirmBooking,
  completeBooking,
  cancelBooking,
} from "@/lib/api/admin/booking";

// get all bookings with pagination, search and status filter for admin dashboard
export const handleGetAllBookings = async ({
  page,
  limit,
  search,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const currentPage = page && page > 0 ? page : 1;
    const currentLimit = limit && limit > 0 ? limit : 10;
    const currentSearch = search || "";
    const currentStatus = status || "all";

    const result = await getAllBookings({
      page: currentPage,
      limit: currentLimit,
      search: currentSearch,
      status: currentStatus,
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
      message: result.message || "Failed to fetch bookings",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch bookings",
    };
  }
};

// get a single booking by id for detail page
export const handleGetBookingById = async (id: string) => {
  try {
    const result = await getBookingById(id);
    if (result.success) {
      return { success: true, message: result.message, data: result.data };
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

// admin confirms a pending booking
export const handleConfirmBooking = async (id: string) => {
  try {
    const result = await confirmBooking(id);
    if (result.success) {
      revalidatePath("/dashboard/bookings"); // refresh booking list after confirm
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to confirm booking",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to confirm booking",
    };
  }
};

// admin completes a confirmed booking
export const handleCompleteBooking = async (id: string) => {
  try {
    const result = await completeBooking(id);
    if (result.success) {
      revalidatePath("/dashboard/bookings"); // refresh booking list after complete
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to complete booking",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to complete booking",
    };
  }
};

// admin cancels a booking - revalidates list page after cancellation
export const handleCancelBooking = async (id: string) => {
  try {
    const result = await cancelBooking(id);
    if (result.success) {
      revalidatePath("/dashboard/bookings"); // refresh booking list after cancel
      return { success: true, message: result.message, data: result.data };
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
