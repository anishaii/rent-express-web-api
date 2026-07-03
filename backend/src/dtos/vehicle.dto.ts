import { z } from "zod";
import { VehicleSchema } from "../types/vehicle.type";

// Create Vehicle DTO - imageUrl omitted because multer sets it after upload
export const CreateVehicleDTO = VehicleSchema.omit({
  imageUrl: true,
});
export type CreateVehicleDTO = z.infer<typeof CreateVehicleDTO>;

// Update Vehicle DTO - all fields optional, only send what needs to change
export const UpdateVehicleDTO = VehicleSchema.partial();
export type UpdateVehicleDTO = z.infer<typeof UpdateVehicleDTO>;
