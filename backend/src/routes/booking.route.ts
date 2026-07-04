import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const bookingRouter = Router();
const bookingController = new BookingController();

// user - create a new booking (must be logged in)
bookingRouter.post(
  "/create",
  authorizedMiddleware,
  bookingController.createBooking,
);

// user - get all their own bookings
bookingRouter.get(
  "/my-bookings",
  authorizedMiddleware,
  bookingController.getMyBookings,
);

// user - get single booking by id
bookingRouter.get(
  "/:id",
  authorizedMiddleware,
  bookingController.getBookingById,
);

// user - cancel their own pending booking
bookingRouter.put(
  "/cancel/:id",
  authorizedMiddleware,
  bookingController.cancelBooking,
);

export default bookingRouter;
