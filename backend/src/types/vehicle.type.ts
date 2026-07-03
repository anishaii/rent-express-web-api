import { z } from "zod";

export const VehicleSchema = z.object({
  // reference to brand
  brandId: z.string().min(1, "Brand is required"),
  // reference to category
  categoryId: z.string().min(1, "Category is required"),
  // vehicle name
  name: z.string().min(1, "Vehicle name is required"),
  // vehicle description
  description: z.string().min(1, "Description is required"),
  // price per day in NPR
  pricePerDay: z.number().positive("Price must be greater than 0"),
  // image path set by multer after upload
  imageUrl: z.string().optional(),
  // fuel type
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"], {
    error: "Please select a fuel type",
  }),
  // number of seats
  seats: z.number().int().positive("Seats must be a positive number"),
  // transmission type
  transmission: z.enum(["Manual", "Automatic"], {
    error: "Please select a transmission type",
  }),
  // availability status - true by default when vehicle is added
  isAvailable: z.boolean().default(true),
});

export type VehicleType = z.infer<typeof VehicleSchema>;
