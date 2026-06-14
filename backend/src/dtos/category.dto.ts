import { z } from "zod";
import { CategorySchema } from "../types/category.type";

// Create Category DTO
export const CreateCategoryDTO = CategorySchema.pick({
  name: true,
  description: true,
});
export type CreateCategoryDTO = z.infer<typeof CreateCategoryDTO>;

// Update Category DTO
export const UpdateCategoryDTO = CategorySchema.pick({
  name: true,
  description: true,
});
export type UpdateCategoryDTO = z.infer<typeof UpdateCategoryDTO>;
