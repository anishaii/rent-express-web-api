import { z } from "zod";
import { FavouriteSchema } from "../types/favourite.type";

// Add Favourite DTO - user sends vehicleId only
// userId is taken from JWT token in service layer
export const AddFavouriteDTO = FavouriteSchema.pick({
  vehicleId: true,
});
export type AddFavouriteDTO = z.infer<typeof AddFavouriteDTO>;
