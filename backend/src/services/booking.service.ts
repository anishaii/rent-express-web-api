import { BookingMongoRepository } from "../repositories/booking.repository";
import { CreateBookingDTO } from "../dtos/booking.dto";
import { IBooking } from "../models/booking.model";
import { HttpException } from "../exceptions/http-exception";
import { VehicleMongoRepository } from "../repositories/vehicle.repository";

const bookingRepository = new BookingMongoRepository();
const vehicleRepository = new VehicleMongoRepository();

export class BookingService {
  // create a new booking - calculates total price and generates custom bookingId
  async createBooking(
    data: CreateBookingDTO,
    customerId: string,
  ): Promise<IBooking> {
    // check if vehicle exists and is available for booking
    const vehicle = await vehicleRepository.getVehicleById(data.vehicleId);
    if (!vehicle) {
      throw new HttpException(404, "Vehicle not found");
    }
    if (!vehicle.isAvailable) {
      throw new HttpException(400, "Vehicle is not available for booking");
    }

    // validate date range
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      throw new HttpException(400, "End date must be after start date");
    }

    // calculate total price based on number of rental days
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = days * vehicle.pricePerDay;

    // create booking first to get mongodb _id for generating bookingId
    const booking = await bookingRepository.createBooking({
      customerId,
      vehicleId: data.vehicleId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalPrice,
      status: "pending",
    } as unknown as Partial<IBooking>);

    // generate custom readable bookingId using last 6 chars of mongodb _id
    const bookingId = "BK" + booking._id.toString().slice(-6).toUpperCase();

    // update booking with the generated bookingId
    await bookingRepository.updateBookingId(booking._id.toString(), bookingId);

    return { ...booking.toObject(), bookingId } as IBooking;
  }

  // get a single booking by mongodb id
  async getBookingById(id: string): Promise<IBooking> {
    const booking = await bookingRepository.getBookingById(id);
    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }
    return booking;
  }

  // get all bookings for admin with pagination, search and status filter
  async getAllBookingsPaginated(
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<{ data: IBooking[]; total: number }> {
    return await bookingRepository.getAllPaginated(page, limit, search, status);
  }

  // get all bookings for the logged in customer
  async getMyBookings(customerId: string): Promise<IBooking[]> {
    return await bookingRepository.getBookingsByCustomerId(customerId);
  }

  // admin confirms a pending booking
  async confirmBooking(id: string): Promise<IBooking> {
    const booking = await bookingRepository.getBookingById(id);
    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }
    if (booking.status !== "pending") {
      throw new HttpException(400, "Only pending bookings can be confirmed");
    }
    const updated = await bookingRepository.updateStatus(id, "confirmed");
    return updated!;
  }

  // admin completes a confirmed booking
  async completeBooking(id: string): Promise<IBooking> {
    const booking = await bookingRepository.getBookingById(id);
    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }
    if (booking.status !== "confirmed") {
      throw new HttpException(400, "Only confirmed bookings can be completed");
    }
    const updated = await bookingRepository.updateStatus(id, "completed");
    return updated!;
  }

  // cancel booking - user can only cancel pending, admin can cancel pending or confirmed
  async cancelBooking(id: string, isAdmin: boolean): Promise<IBooking> {
    const booking = await bookingRepository.getBookingById(id);
    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }
    if (booking.status === "completed" || booking.status === "cancelled") {
      throw new HttpException(400, "This booking cannot be cancelled");
    }
    if (!isAdmin && booking.status !== "pending") {
      throw new HttpException(400, "You can only cancel pending bookings");
    }
    const updated = await bookingRepository.updateStatus(id, "cancelled");
    return updated!;
  }
}
