import { z } from "zod";

export const FavouriteSchema = z.object({
  // reference to the user who added the favourite
  userId: z.string().min(1, "User is required"),
  // reference to the vehicle being favourited
  vehicleId: z.string().min(1, "Vehicle is required"),
});

export type FavouriteType = z.infer<typeof FavouriteSchema>;
