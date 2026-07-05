import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all bookings with pagination, optional search and status filter for admin dashboard
export const getAllBookings = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.BOOKINGS.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch bookings",
    );
  }
};

// get a single booking by id for admin detail page
export const getBookingById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.BOOKINGS.GET_BY_ID(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch booking",
    );
  }
};

// admin confirms a pending booking
export const confirmBooking = async (id: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.BOOKINGS.CONFIRM(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to confirm booking",
    );
  }
};

// admin completes a confirmed booking
export const completeBooking = async (id: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.BOOKINGS.COMPLETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to complete booking",
    );
  }
};

// admin cancels a booking
export const cancelBooking = async (id: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.BOOKINGS.CANCEL(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to cancel booking",
    );
  }
};
