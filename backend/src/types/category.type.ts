import { z } from "zod";

export const CategorySchema = z.object({
  name: z.enum([
    "Bike",
    "Scooter",
    "Car",
    "Van",
    "Pickup Truck",
    "Luxury Car",
    "Electric Vehicle",
  ]),
  description: z.string().min(1, "Description is required"),
});

export type CategoryType = z.infer<typeof CategorySchema>;
