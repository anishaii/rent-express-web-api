import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, data);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

export const login = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, data);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};
// get currently logged in user's details
export const whoami = async () => {
  try {
    const response = await axiosInstance.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch user details",
    );
  }
};
// update profile - sends form-data since image upload is involved
export const updateProfile = async (data: any) => {
  try {
    const response = await axiosInstance.put(API.AUTH.UPDATE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update profile",
    );
  }
};
