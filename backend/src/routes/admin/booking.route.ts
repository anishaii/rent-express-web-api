import { Router } from "express";
import { AdminBookingController } from "../../controllers/admin/booking.controller";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";

const adminBookingRoute = Router();
const adminBookingController = new AdminBookingController();

// admin only - get all bookings with pagination, search and status filter
adminBookingRoute.get(
  "/",
  authorizedMiddleware,
  adminMiddleware,
  adminBookingController.getAllBookingsPaginated,
);

// admin only - get single booking by id
adminBookingRoute.get(
  "/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminBookingController.getBookingById,
);

// admin only - confirm a pending booking
adminBookingRoute.put(
  "/confirm/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminBookingController.confirmBooking,
);

// admin only - complete a confirmed booking
adminBookingRoute.put(
  "/complete/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminBookingController.completeBooking,
);

// admin only - cancel a booking
adminBookingRoute.put(
  "/cancel/:id",
  authorizedMiddleware,
  adminMiddleware,
  adminBookingController.cancelBooking,
);

export default adminBookingRoute;
