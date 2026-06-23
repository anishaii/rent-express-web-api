import { z } from "zod";

export const BrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().optional(), // set by multer after image upload
});

export type BrandType = z.infer<typeof BrandSchema>;
