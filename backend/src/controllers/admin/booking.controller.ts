import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { BookingService } from "../../services/booking.service";

const bookingService = new BookingService();

export class AdminBookingController {
  // admin - get all bookings with pagination, search and status filter
  async getAllBookingsPaginated(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;

      const result = await bookingService.getAllBookingsPaginated(
        page,
        limit,
        search,
        status,
      );

      return ApiResponseHelper.success(
        res,
        {
          data: result.data,
          pagination: {
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit),
          },
        },
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

  // admin - get single booking by id
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

  // admin - confirm a pending booking
  async confirmBooking(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const booking = await bookingService.confirmBooking(id);
      return ApiResponseHelper.success(
        res,
        booking,
        "Booking confirmed successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // admin - complete a confirmed booking
  async completeBooking(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const booking = await bookingService.completeBooking(id);
      return ApiResponseHelper.success(
        res,
        booking,
        "Booking completed successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // admin - cancel any pending or confirmed booking
  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      // isAdmin = true so admin can cancel pending or confirmed bookings
      const booking = await bookingService.cancelBooking(id, true);
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
