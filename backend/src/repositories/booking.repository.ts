import { BookingModel, IBooking } from "../models/booking.model";

export interface IBookingRepository {
  createBooking(booking: Partial<IBooking>): Promise<IBooking>;
  getBookingById(id: string): Promise<IBooking | null>;
  getBookingByBookingId(bookingId: string): Promise<IBooking | null>;
  getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<{ data: IBooking[]; total: number }>;
  getBookingsByCustomerId(customerId: string): Promise<IBooking[]>;
  updateBookingId(id: string, bookingId: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<IBooking | null>;
  delete(id: string): Promise<boolean>;
}

export class BookingMongoRepository implements IBookingRepository {
  async createBooking(booking: Partial<IBooking>): Promise<IBooking> {
    const created = await BookingModel.create(booking);
    return created;
  }

  async getBookingById(id: string): Promise<IBooking | null> {
    // populate customer and vehicle so we get full objects not just ids
    const found = await BookingModel.findById(id)
      .populate("customerId")
      .populate({
        path: "vehicleId",
        populate: [{ path: "brandId" }, { path: "categoryId" }],
      });
    return found;
  }

  // find booking by custom readable id e.g. BK3c889e
  async getBookingByBookingId(bookingId: string): Promise<IBooking | null> {
    const found = await BookingModel.findOne({ bookingId });
    return found;
  }

  // get all bookings with pagination, optional search and status filter
  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<{ data: IBooking[]; total: number }> {
    // build filter based on search and status
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const total = await BookingModel.countDocuments(filter);
    const data = await BookingModel.find(filter)
      .populate("customerId")
      .populate({
        path: "vehicleId",
        populate: [{ path: "brandId" }, { path: "categoryId" }],
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // filter by search term after populate since we need customer and vehicle names
    if (search) {
      const searchLower = search.toLowerCase();
      return {
        data: data.filter((booking: any) => {
          const customerName =
            booking.customerId?.fullName?.toLowerCase() || "";
          const vehicleName = booking.vehicleId?.name?.toLowerCase() || "";
          const bookingId = booking.bookingId?.toLowerCase() || "";
          return (
            customerName.includes(searchLower) ||
            vehicleName.includes(searchLower) ||
            bookingId.includes(searchLower)
          );
        }),
        total,
      };
    }

    return { data, total };
  }

  // get all bookings for a specific customer - used in user booking history
  async getBookingsByCustomerId(customerId: string): Promise<IBooking[]> {
    const found = await BookingModel.find({ customerId })
      .populate({
        path: "vehicleId",
        populate: [{ path: "brandId" }, { path: "categoryId" }],
      })
      .sort({ createdAt: -1 });
    return found;
  }

  // update booking with generated readable bookingId after creation
  async updateBookingId(id: string, bookingId: string): Promise<void> {
    await BookingModel.findByIdAndUpdate(id, { bookingId });
  }

  // update booking status only - used for confirm, complete, cancel actions
  async updateStatus(id: string, status: string): Promise<IBooking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await BookingModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
