import { z } from "zod";
import { BrandSchema } from "../types/brand.type";

// creating a new brand
export const CreateBrandDTO = BrandSchema.pick({
  name: true,
});
export type CreateBrandDTO = z.infer<typeof CreateBrandDTO>;

// updating a brand: all fields optional since admin might only update name or logo
export const UpdateBrandDTO = BrandSchema.partial();
export type UpdateBrandDTO = z.infer<typeof UpdateBrandDTO>;
