import mongoose from "mongoose";
import { BookingMongoRepository } from "../../../repositories/booking.repository";
import { BookingModel } from "../../../models/booking.model";
import { VehicleModel } from "../../../models/vehicle.model";
import { BrandModel } from "../../../models/brand.model";
import { CategoryModel } from "../../../models/category.model";
import { UserModel } from "../../../models/user.model";

// Unit tests for BookingMongoRepository
describe("Unit: BookingMongoRepository", () => {
  const bookingRepository = new BookingMongoRepository();

  let customerId: string;
  let vehicleId: string;
  let bookingIdToTest: string;

  beforeAll(async () => {
    await BookingModel.deleteMany({});
    await VehicleModel.deleteMany({ name: "Repo Test Vehicle" });

    const user = await UserModel.findOneAndUpdate(
      { email: "booking-repo-test@example.com" },
      {
        fullName: "Booking Repo Test User",
        email: "booking-repo-test@example.com",
        contactNumber: "9800000001",
        gender: "male",
        password: "hashedpasswordplaceholder",
        role: "user",
      },
      { upsert: true, new: true },
    );
    customerId = user._id.toString();

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

    const vehicle = await VehicleModel.create({
      name: "Repo Test Vehicle",
      brandId: brand._id,
      categoryId: category._id,
      pricePerDay: 500,
      fuelType: "Petrol",
      seats: 4,
      transmission: "Manual",
      description: "test vehicle for repo tests",
      isAvailable: true,
    });
    vehicleId = vehicle._id.toString();
  });

  afterAll(async () => {
    await VehicleModel.deleteMany({ name: "Repo Test Vehicle" });
    await BookingModel.deleteMany({ customerId });
  });

  test("should create a booking", async () => {
    const booking = await bookingRepository.createBooking({
      customerId,
      vehicleId,
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-08-03"),
      totalPrice: 1000,
      status: "pending",
    } as any);

    expect(booking).toBeDefined();
    expect(booking).toHaveProperty("_id");
    expect(booking.status).toBe("pending");
    bookingIdToTest = booking._id.toString();
  });

  test("should find booking by id with populated vehicle and customer", async () => {
    const found = await bookingRepository.getBookingById(bookingIdToTest);
    expect(found).toBeDefined();
    expect((found as any).vehicleId.name).toBe("Repo Test Vehicle");
    expect((found as any).customerId.email).toBe(
      "booking-repo-test@example.com",
    );
  });

  test("should return null for non-existing booking id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await bookingRepository.getBookingById(fakeId);
    expect(found).toBeNull();
  });

  test("should update bookingId with custom readable id", async () => {
    await bookingRepository.updateBookingId(bookingIdToTest, "BKTESTID1");
    const found = await bookingRepository.getBookingByBookingId("BKTESTID1");
    expect(found).toBeDefined();
    expect(found?.bookingId).toBe("BKTESTID1");
  });

  test("should update booking status", async () => {
    const updated = await bookingRepository.updateStatus(
      bookingIdToTest,
      "confirmed",
    );
    expect(updated?.status).toBe("confirmed");
  });

  test("should get all bookings for a specific customer", async () => {
    const bookings =
      await bookingRepository.getBookingsByCustomerId(customerId);
    expect(bookings.length).toBeGreaterThan(0);
    expect(bookings[0].customerId.toString()).toBe(customerId);
  });

  test("should get all bookings paginated", async () => {
    const result = await bookingRepository.getAllPaginated(1, 10);
    expect(result.data).toBeDefined();
    expect(result.total).toBeGreaterThan(0);
  });

  test("should filter paginated bookings by status", async () => {
    const result = await bookingRepository.getAllPaginated(
      1,
      10,
      undefined,
      "confirmed",
    );
    expect(result.data.every((b) => b.status === "confirmed")).toBe(true);
  });

  test("should delete a booking", async () => {
    const deleted = await bookingRepository.delete(bookingIdToTest);
    expect(deleted).toBe(true);
  });
});
