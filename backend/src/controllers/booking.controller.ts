import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { CreateBookingDTO } from "../dtos/booking.dto";
import { BookingService } from "../services/booking.service";

const bookingService = new BookingService();

export class BookingController {
  // user - create a new booking
  async createBooking(req: Request, res: Response) {
    try {
      const bookingData = CreateBookingDTO.safeParse({
        ...req.body,
        // convert date strings to Date objects
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      });

      if (!bookingData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(bookingData.error),
          400,
        );
      }

      // get customerId from JWT token set by authorizedMiddleware
      const customerId = (req as any).user?.id;
      if (!customerId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const booking = await bookingService.createBooking(
        bookingData.data,
        customerId,
      );
      return ApiResponseHelper.success(
        res,
        booking,
        "Booking created successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // user - get all their own bookings
  async getMyBookings(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.id;
      if (!customerId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const bookings = await bookingService.getMyBookings(customerId);
      return ApiResponseHelper.success(
        res,
        bookings,
        "Bookings fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // user - get single booking by id
  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const booking = await bookingService.getBookingById(id);
      return ApiResponseHelper.success(
        res,
        booking,
        "Booking fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // user - cancel their own pending booking only
  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      // isAdmin = false so user can only cancel pending bookings
      const booking = await bookingService.cancelBooking(id, false);
      return ApiResponseHelper.success(
        res,
        booking,
        "Booking cancelled successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
