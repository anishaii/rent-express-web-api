import { z } from "zod";

export const CategorySchema = z.object({
  name: z.enum([
    "Bike",
    "Scooter",
    "Car",
    "Luxury Car",
    "Jeep",
    "Recreational Vehicle",
  ]),
  description: z.string().min(1, "Description is required"),
});

export type CategoryType = z.infer<typeof CategorySchema>;
