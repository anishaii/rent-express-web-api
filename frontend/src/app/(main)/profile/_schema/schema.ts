import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"]; // backend fileFilter

// profile update schema - password and role excluded intentionally (handled separately / not user editable)
export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Contact number must contain only digits"),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg and .png formats are supported",
    }),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
