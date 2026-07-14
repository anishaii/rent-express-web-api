import { UserService } from "../services/user.service";
import { z } from "zod";
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";
import { HttpException } from "../exceptions/http-exception";

const userService = new UserService();

export class UserController {
  async registerUser(req: Request, res: Response) {
    try {
      const userData = RegisterUserDTO.safeParse(req.body);
      if (!userData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(userData.error),
          400,
        );
      }
      const user = await userService.registerUser(userData.data);
      return ApiResponseHelper.success(
        res,
        user,
        "User registered successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }
      const { user, token } = await userService.loginUser(parsedData.data);
      return ApiResponseHelper.success(
        res,
        { user, token },
        "Login successful",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // Update logged in user profile
  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      const filename = req.file?.filename;

      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }
      // console.log("Parsed update data:", parsedData.data);
      if (filename) {
        parsedData.data.imageUrl = "/uploads/" + filename;
      }

      const updatedUser = await userService.updateUser(
        userId as string,
        parsedData.data,
      );
      return ApiResponseHelper.success(
        res,
        updatedUser,
        "User updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // Get logged in user detail
  async whoami(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      return ApiResponseHelper.success(
        res,
        user,
        "User retrieved successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // send password reset email
  async sendResetPasswordEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        throw new HttpException(400, "Email is required");
      }
      const { token } = await userService.sendResetPasswordEmail(email);
      return ApiResponseHelper.success(
        res,
        { token },
        "Reset password email sent successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // reset password using token from email link
  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params as { token: string };
      const { newPassword } = req.body;
      if (!newPassword) {
        throw new HttpException(400, "New password is required");
      }
      const updatedUser = await userService.resetPassword(token, newPassword);
      return ApiResponseHelper.success(
        res,
        updatedUser,
        "Password reset successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
