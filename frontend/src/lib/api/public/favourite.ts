import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// add vehicle to favourites
export const addFavourite = async (vehicleId: string) => {
  try {
    const response = await axiosInstance.post(API.USER.FAVOURITES.ADD, {
      vehicleId,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to add favourite",
    );
  }
};

// get all favourites for logged in user
export const getMyFavourites = async () => {
  try {
    const response = await axiosInstance.get(
      API.USER.FAVOURITES.GET_MY_FAVOURITES,
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch favourites",
    );
  }
};

// check if vehicle is in favourites
export const checkFavourite = async (vehicleId: string) => {
  try {
    const response = await axiosInstance.get(
      API.USER.FAVOURITES.CHECK(vehicleId),
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to check favourite",
    );
  }
};

// remove vehicle from favourites
export const removeFavourite = async (vehicleId: string) => {
  try {
    const response = await axiosInstance.delete(
      API.USER.FAVOURITES.REMOVE(vehicleId),
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to remove favourite",
    );
  }
};
