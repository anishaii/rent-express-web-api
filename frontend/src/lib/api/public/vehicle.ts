import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// fetch all vehicles for public listing page
export const getPublicVehicles = async () => {
  try {
    const response = await axiosInstance.get(API.PUBLIC.VEHICLES);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicles",
    );
  }
};

// fetch single vehicle by id for detail page
export const getPublicVehicleById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.PUBLIC.VEHICLE_BY_ID(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicle",
    );
  }
};
