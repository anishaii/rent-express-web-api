import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// create a new booking - user must be logged in
export const createBooking = async (data: {
  vehicleId: string;
  startDate: string;
  endDate: string;
}) => {
  try {
    const response = await axiosInstance.post(API.USER.BOOKINGS.CREATE, data);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to create booking",
    );
  }
};

// get all bookings for logged in user
export const getMyBookings = async () => {
  try {
    const response = await axiosInstance.get(API.USER.BOOKINGS.GET_MY_BOOKINGS);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch bookings",
    );
  }
};

// get single booking by id
export const getBookingById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.USER.BOOKINGS.GET_BY_ID(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch booking",
    );
  }
};

// cancel a pending booking
export const cancelBooking = async (id: string) => {
  try {
    const response = await axiosInstance.put(API.USER.BOOKINGS.CANCEL(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to cancel booking",
    );
  }
};
