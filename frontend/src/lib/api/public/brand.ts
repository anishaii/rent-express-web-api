import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// fetch all brands for dropdowns - used in vehicle form
export const getPublicBrands = async () => {
  try {
    const response = await axiosInstance.get(API.PUBLIC.BRANDS);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch brands");
  }
};
