import mongoose from "mongoose";
import { BookingService } from "../../../services/booking.service";
import { VehicleModel } from "../../../models/vehicle.model";
import { BookingModel } from "../../../models/booking.model";
import { BrandModel } from "../../../models/brand.model";
import { CategoryModel } from "../../../models/category.model";
import { UserModel } from "../../../models/user.model";

// Unit tests for BookingService - covers price calculation and status transition rules
describe("Unit: BookingService", () => {
  const bookingService = new BookingService();

  let customerId: string;
  let availableVehicleId: string;
  let unavailableVehicleId: string;

  beforeAll(async () => {
    await BookingModel.deleteMany({});
    await VehicleModel.deleteMany({
      name: { $in: ["Test Available Car", "Test Unavailable Car"] },
    });

    // get or create a real user so populate("customerId") doesn't fail
    const user = await UserModel.findOneAndUpdate(
      { email: "booking-test@example.com" },
      {
        fullName: "Booking Test User",
        email: "booking-test@example.com",
        contactNumber: "9800000000",
        gender: "male",
        password: "hashedpasswordplaceholder",
        role: "user",
      },
      { upsert: true, new: true },
    );
    customerId = user._id.toString();

    // get or create a real brand/category so populate() doesn't fail
    const brand = await BrandModel.findOneAndUpdate(
      { name: "Test Brand" },
      { name: "Test Brand" },
      { upsert: true, new: true },
    );
    const category = await CategoryModel.findOneAndUpdate(
      { name: "Car" },
      { name: "Car", description: "test category" },
      { upsert: true, new: true },
    );

    const availableVehicle = await VehicleModel.create({
      name: "Test Available Car",
      brandId: brand._id,
      categoryId: category._id,
      pricePerDay: 1000,
      fuelType: "Petrol",
      seats: 5,
      transmission: "Manual",
      description: "test vehicle",
      isAvailable: true,
    });
    availableVehicleId = availableVehicle._id.toString();

    const unavailableVehicle = await VehicleModel.create({
      name: "Test Unavailable Car",
      brandId: brand._id,
      categoryId: category._id,
      pricePerDay: 1000,
      fuelType: "Petrol",
      seats: 5,
      transmission: "Manual",
      description: "test vehicle",
      isAvailable: false,
    });
    unavailableVehicleId = unavailableVehicle._id.toString();
  });

  afterAll(async () => {
    await VehicleModel.deleteMany({
      name: { $in: ["Test Available Car", "Test Unavailable Car"] },
    });
    await BookingModel.deleteMany({ customerId });
  });

  test("should create a booking and calculate total price correctly", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-08-01") as any,
        endDate: new Date("2026-08-04") as any,
      },
      customerId,
    );

    // 3 days * NPR 1000 per day
    expect(booking.totalPrice).toBe(3000);
    expect(booking.status).toBe("pending");
    expect(booking.bookingId).toBeDefined();
  });

  test("should throw error if vehicle does not exist", async () => {
    const fakeVehicleId = new mongoose.Types.ObjectId().toString();
    await expect(
      bookingService.createBooking(
        {
          vehicleId: fakeVehicleId,
          startDate: new Date("2026-08-01") as any,
          endDate: new Date("2026-08-04") as any,
        },
        customerId,
      ),
    ).rejects.toThrow("Vehicle not found");
  });

  test("should throw error if vehicle is not available", async () => {
    await expect(
      bookingService.createBooking(
        {
          vehicleId: unavailableVehicleId,
          startDate: new Date("2026-08-01") as any,
          endDate: new Date("2026-08-04") as any,
        },
        customerId,
      ),
    ).rejects.toThrow("Vehicle is not available for booking");
  });

  test("should throw error if end date is before start date", async () => {
    await expect(
      bookingService.createBooking(
        {
          vehicleId: availableVehicleId,
          startDate: new Date("2026-08-05") as any,
          endDate: new Date("2026-08-01") as any,
        },
        customerId,
      ),
    ).rejects.toThrow("End date must be after start date");
  });

  test("should confirm a pending booking", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-09-01") as any,
        endDate: new Date("2026-09-03") as any,
      },
      customerId,
    );

    const confirmed = await bookingService.confirmBooking(
      booking._id.toString(),
    );
    expect(confirmed.status).toBe("confirmed");
  });

  test("should not confirm a booking that is already confirmed", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-09-05") as any,
        endDate: new Date("2026-09-07") as any,
      },
      customerId,
    );
    const confirmed = await bookingService.confirmBooking(
      booking._id.toString(),
    );

    await expect(
      bookingService.confirmBooking(confirmed._id.toString()),
    ).rejects.toThrow("Only pending bookings can be confirmed");
  });

  test("should complete a confirmed booking", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-09-10") as any,
        endDate: new Date("2026-09-12") as any,
      },
      customerId,
    );
    const confirmed = await bookingService.confirmBooking(
      booking._id.toString(),
    );
    const completed = await bookingService.completeBooking(
      confirmed._id.toString(),
    );
    expect(completed.status).toBe("completed");
  });

  test("should not complete a booking that is still pending", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-09-15") as any,
        endDate: new Date("2026-09-17") as any,
      },
      customerId,
    );

    await expect(
      bookingService.completeBooking(booking._id.toString()),
    ).rejects.toThrow("Only confirmed bookings can be completed");
  });

  test("user should be able to cancel a pending booking", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-09-20") as any,
        endDate: new Date("2026-09-22") as any,
      },
      customerId,
    );

    const cancelled = await bookingService.cancelBooking(
      booking._id.toString(),
      false,
    );
    expect(cancelled.status).toBe("cancelled");
  });

  test("user should not be able to cancel a confirmed booking", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-09-25") as any,
        endDate: new Date("2026-09-27") as any,
      },
      customerId,
    );
    const confirmed = await bookingService.confirmBooking(
      booking._id.toString(),
    );

    await expect(
      bookingService.cancelBooking(confirmed._id.toString(), false),
    ).rejects.toThrow("You can only cancel pending bookings");
  });

  test("admin should be able to cancel a confirmed booking", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-10-01") as any,
        endDate: new Date("2026-10-03") as any,
      },
      customerId,
    );
    const confirmed = await bookingService.confirmBooking(
      booking._id.toString(),
    );

    const cancelled = await bookingService.cancelBooking(
      confirmed._id.toString(),
      true,
    );
    expect(cancelled.status).toBe("cancelled");
  });

  test("should not cancel a completed booking", async () => {
    const booking = await bookingService.createBooking(
      {
        vehicleId: availableVehicleId,
        startDate: new Date("2026-10-05") as any,
        endDate: new Date("2026-10-07") as any,
      },
      customerId,
    );
    const confirmed = await bookingService.confirmBooking(
      booking._id.toString(),
    );
    const completed = await bookingService.completeBooking(
      confirmed._id.toString(),
    );

    await expect(
      bookingService.cancelBooking(completed._id.toString(), true),
    ).rejects.toThrow("This booking cannot be cancelled");
  });
});
