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

// Update DTO - all fields optional, password excluded (handled separately)
export const UpdateUserDTO = UserSchema.omit({
  password: true,
  role: true,
}).partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
