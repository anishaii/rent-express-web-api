import { z } from "zod";
import { BookingSchema } from "../types/booking.type";

// Create Booking DTO - user only sends vehicleId, startDate, endDate
// customerId is taken from JWT token in service layer
// totalPrice and bookingId are calculated/generated automatically
export const CreateBookingDTO = BookingSchema.pick({
  vehicleId: true,
  startDate: true,
  endDate: true,
});
export type CreateBookingDTO = z.infer<typeof CreateBookingDTO>;

// Update Booking Status DTO - only status can be updated
export const UpdateBookingStatusDTO = BookingSchema.pick({
  status: true,
});
export type UpdateBookingStatusDTO = z.infer<typeof UpdateBookingStatusDTO>;
