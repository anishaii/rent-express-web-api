"use server";

import { RegisterFormData, LoginFormData } from "@/app/(auth)/_schema/schema";
import { register, login, whoami, updateProfile } from "../api/auth";
import { setTokenCookie, storeUserData } from "../cookies";
import { revalidatePath } from "next/cache";

// REGISTER
export const handleRegisterUser = async (data: RegisterFormData) => {
  try {
    const result = await register(data);
    if (result.success) {
      return { success: true, message: result.message, data: result.data };
    } else {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }
  } catch (error: Error | any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

// LOGIN
export const handleLoginUser = async (data: LoginFormData) => {
  try {
    const result = await login(data);
    const user = result.data.user;
    const token = result.data.token;
    await setTokenCookie(token);
    await storeUserData(user);
    if (result.success) {
      return { success: true, message: result.message, data: result.data };
    } else {
      return { success: false, message: result.message || "Login failed" };
    }
  } catch (error: Error | any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};

// GET LOGGED IN USER DETAILS  - used to prefill profile update form
export const handleUserDetails = async () => {
  try {
    const result = await whoami();
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        message: result.message || "Failed to fetch user",
      };
    }
  } catch (error: Error | any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch user",
    };
  }
};

// UPDATE PROFILE
export const handleUpdateProfile = async (data: FormData) => {
  try {
    const result = await updateProfile(data);
    if (result.success) {
      await storeUserData(result.data); // refresh user_data cookie with updated info
      revalidatePath("/profile"); // refresh profile page data after update so new values show without manual refresh
      return { success: true, message: result.message, data: result.data };
    } else {
      return {
        success: false,
        message: result.message || "Update user failed",
      };
    }
  } catch (error: Error | any) {
    return { success: false, message: error?.message || "Update user failed" };
  }
};
