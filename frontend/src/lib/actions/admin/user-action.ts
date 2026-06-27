"use server";

import { revalidatePath } from "next/cache";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "@/lib/api/admin/user";

// get all users with pagination and search
export const handleGetAllUsers = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const currentPage = page && page > 0 ? page : 1;
    const currentLimit = limit && limit > 0 ? limit : 10;
    const currentSearch = search || "";

    const result = await getAllUsers({
      page: currentPage,
      limit: currentLimit,
      search: currentSearch,
    });

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data,
        pagination: result.meta, // meta from api contains page, limit, total, totalPages
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch users",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch users",
    };
  }
};

// get a single user by id
export const handleGetUserById = async (id: string) => {
  try {
    const result = await getUserById(id);
    if (result.success) {
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch user",
    };
  }
};

// admin creates a new user
export const handleCreateUser = async (data: any) => {
  try {
    const result = await createUser(data);
    if (result.success) {
      revalidatePath("/dashboard/users"); // refresh user list after creation
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "User creation failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "User creation failed",
    };
  }
};

// admin updates a user's profile
export const handleUpdateUser = async (id: string, data: any) => {
  try {
    const result = await updateUser(id, data);
    if (result.success) {
      revalidatePath("/dashboard/users"); // refresh user list after update
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to update user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user",
    };
  }
};

// admin updates a user's password
export const handleUpdateUserPassword = async (id: string, data: any) => {
  try {
    const result = await updateUserPassword(id, data);
    if (result.success) {
      revalidatePath("/dashboard/users");
      return { success: true, message: result.message, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to update user password",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user password",
    };
  }
};

// admin deletes a user - revalidates list page after deletion
export const handleDeleteUser = async (id: string) => {
  try {
    const result = await deleteUser(id);
    if (result.success) {
      revalidatePath("/dashboard/users"); // refresh user list after deletion
      return { success: true, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Failed to delete user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete user",
    };
  }
};
