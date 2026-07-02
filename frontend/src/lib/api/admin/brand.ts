import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all brands with pagination and optional search for admin dashboard
export const getAllBrands = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.BRANDS.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch brands");
  }
};

// admin creates a new brand - multipart because logo image upload is possible
export const createBrand = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(API.ADMIN.BRANDS.CREATE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to create brand");
  }
};

// admin updates a brand - multipart because logo image can be changed
export const updateBrand = async (id: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.ADMIN.BRANDS.UPDATE(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to update brand");
  }
};

// admin deletes a brand by id
export const deleteBrand = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.ADMIN.BRANDS.DELETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to delete brand");
  }
};
