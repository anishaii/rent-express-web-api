import { z } from "zod";

export const BookingSchema = z.object({
  // reference to the customer who made the booking
  customerId: z.string().min(1, "Customer is required"),
  // reference to the vehicle being booked
  vehicleId: z.string().min(1, "Vehicle is required"),
  // rental start date
  startDate: z.coerce.date(),
  // rental end date
  endDate: z.coerce.date(),
  // total price calculated automatically in service layer
  totalPrice: z.number().positive("Total price must be greater than 0"),
  // booking status flow: pending → confirmed → completed or cancelled
  status: z
    .enum(["pending", "confirmed", "completed", "cancelled"])
    .default("pending"),
  // custom readable booking id e.g. BK3c889e - set after creation
  bookingId: z.string().optional(),
});

export type BookingType = z.infer<typeof BookingSchema>;
