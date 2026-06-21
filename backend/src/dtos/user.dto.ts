import { z } from "zod";
import { UserSchema } from "../types/user.type";

// Create a DTO for registering a user
export const RegisterUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  contactNumber: true,
  gender: true,
  password: true,
  role: true,
});
export type RegisterUserDTO = z.infer<typeof RegisterUserDTO>;

// Login DTO - reuse existing schema
export const LoginUserDTO = UserSchema.pick({
  email: true,
  password: true,
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// Update DTO - all fields optional, role excluded for security
// password is allowed through for the password change flow, gets hashed in service before saving
export const UpdateUserDTO = UserSchema.omit({
  role: true,
}).partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
