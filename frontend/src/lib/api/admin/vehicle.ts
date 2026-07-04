import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all vehicles with pagination and optional search for admin dashboard
export const getAllVehicles = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.VEHICLES.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicles",
    );
  }
};

// get a single vehicle by id for admin detail/edit page
export const getVehicleById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.VEHICLES.GET_BY_ID(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicle",
    );
  }
};

// admin creates a new vehicle - multipart because image upload is possible
export const createVehicle = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(API.ADMIN.VEHICLES.CREATE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to create vehicle",
    );
  }
};

// admin updates a vehicle - multipart because image can be changed
export const updateVehicle = async (id: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.ADMIN.VEHICLES.UPDATE(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update vehicle",
    );
  }
};

// admin deletes a vehicle by id
export const deleteVehicle = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.ADMIN.VEHICLES.DELETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete vehicle",
    );
  }
};
