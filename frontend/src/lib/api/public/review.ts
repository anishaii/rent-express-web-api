import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get featured reviews for homepage - public, no auth needed
export const getFeaturedReviews = async (limit?: number) => {
  try {
    const response = await axiosInstance.get(API.PUBLIC.FEATURED_REVIEWS, {
      params: limit ? { limit } : {},
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch featured reviews",
    );
  }
};
