import { UserMongoRepository } from "../repositories/user.repository";
import {
  RegisterUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
  CreateUserDTOAdmin,
} from "../dtos/user.dto";
import { IUser } from "../models/user.model";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { HttpException } from "../exceptions/http-exception";
import { CLIENT_URL } from "../configs/constant";
import { sendEmail } from "../configs/email";

const userRepository = new UserMongoRepository();

export class UserService {
  // register a new user (public)
  async registerUser(userData: RegisterUserDTO): Promise<IUser> {
    const existingEmail = await userRepository.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = await userRepository.createUser(userData);
    return user;
  }

  async loginUser(loginData: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(loginData.email);
    if (!user) {
      throw new HttpException(400, "Invalid email");
    }
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid password");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "30d" },
    );
    return { user, token };
  }

  // admin create user - can assign any role
  async createUser(userData: CreateUserDTOAdmin): Promise<IUser> {
    const existingEmail = await userRepository.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = await userRepository.createUser(userData);
    return user;
  }

  // verify current password before allowing password change
  async checkPassword(
    userId: string,
    currentPassword: string,
  ): Promise<boolean> {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(400, "Current password is incorrect");
    }
    return isPasswordValid;
  }

  async updateUser(id: string, userData: UpdateUserDTO): Promise<IUser> {
    const existingUser = await userRepository.getUserById(id);
    if (!existingUser) {
      throw new HttpException(404, "User not found");
    }
    // if changing password, verify current password first
    if (userData.password) {
      const currentPassword = (userData as any).currentPassword;
      if (!currentPassword) {
        throw new HttpException(
          400,
          "Current password is required to change password",
        );
      }
      await this.checkPassword(id, currentPassword); // throws if incorrect
    }
    // check duplicate email only if email is being changed
    if (userData.email && userData.email !== existingUser.email) {
      const existingEmail = await userRepository.getUserByEmail(userData.email);
      if (existingEmail) {
        throw new HttpException(400, "Email already exists");
      }
    }

    // hash password if it's part of this update
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    // strip currentPassword before saving - it's only for verification, not storage
    delete (userData as any).currentPassword;

    const updatedUser = await userRepository.update(id, userData);
    if (!updatedUser) {
      throw new HttpException(500, "Failed to update user");
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const existingUser = await userRepository.getUserById(id);
    if (!existingUser) {
      throw new HttpException(404, "User not found");
    }
    const deleted = await userRepository.delete(id);
    if (!deleted) {
      throw new HttpException(500, "Failed to delete user");
    }
    return deleted;
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    return user;
  }

  // paginated user list with optional search - used by admin panel
  async getAllUserPaginated(page?: string, limit?: string, search?: string) {
    const currentPage = page && parseInt(page) > 0 ? parseInt(page) : 1;
    const currentLimit = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
    const currentSearch = search && search.trim() !== "" ? search : undefined;

    const { data, total } = await userRepository.getAllPaginated(
      currentPage,
      currentLimit,
      currentSearch,
    );

    const totalPages = Math.ceil(total / currentLimit);
    const pagination = {
      page: currentPage,
      limit: currentLimit,
      totalPages,
      total,
    };

    return { data, pagination };
  }
  // send password reset email with a time-limited JWT token
  async sendResetPasswordEmail(email: string): Promise<{ token: string }> {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
    const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;

    await sendEmail(user.email, "Reset your RentExpress password", html);
    return { token };
  }

  // verify reset token and update password
  async resetPassword(token: string, newPassword: string): Promise<IUser> {
    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    } catch {
      throw new HttpException(400, "Invalid or expired token");
    }

    const user = await userRepository.getUserById(decoded.id);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userRepository.update(decoded.id, {
      password: hashedPassword,
    });
    return updatedUser!;
  }
}
