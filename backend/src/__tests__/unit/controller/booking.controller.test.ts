import { Request, Response } from "express";
import { BookingController } from "../../../controllers/booking.controller";
import { BookingModel } from "../../../models/booking.model";
import { VehicleModel } from "../../../models/vehicle.model";
import { BrandModel } from "../../../models/brand.model";
import { CategoryModel } from "../../../models/category.model";
import { UserModel } from "../../../models/user.model";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Unit tests for BookingController - mocks req/res, uses real service and test DB
describe("Unit: BookingController", () => {
  const bookingController = new BookingController();

  let customerId: string;
  let vehicleId: string;
  let bookingId: string;

  beforeAll(async () => {
    await BookingModel.deleteMany({});
    await VehicleModel.deleteMany({ name: "Controller Test Vehicle" });

    const user = await UserModel.findOneAndUpdate(
      { email: "booking-controller-test@example.com" },
      {
        fullName: "Booking Controller Test User",
        email: "booking-controller-test@example.com",
        contactNumber: "9800000003",
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
      name: "Controller Test Vehicle",
      brandId: brand._id,
      categoryId: category._id,
      pricePerDay: 600,
      fuelType: "Petrol",
      seats: 4,
      transmission: "Manual",
      description: "test vehicle for controller tests",
      isAvailable: true,
    });
    vehicleId = vehicle._id.toString();
  });

  afterAll(async () => {
    await VehicleModel.deleteMany({ name: "Controller Test Vehicle" });
    await BookingModel.deleteMany({ customerId });
  });

  describe("createBooking", () => {
    test("should return 200 and create booking with valid data", async () => {
      const req = {
        body: { vehicleId, startDate: "2026-08-01", endDate: "2026-08-03" },
        user: { id: customerId },
      } as unknown as Request;
      const res = mockResponse();

      await bookingController.createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(true);
      expect(jsonArg.data.totalPrice).toBe(1200); // 2 days * 600
      bookingId = jsonArg.data._id.toString();
    });

    test("should return 400 for missing required fields", async () => {
      const req = {
        body: { vehicleId },
        user: { id: customerId },
      } as unknown as Request;
      const res = mockResponse();

      await bookingController.createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(false);
    });

    test("should return 401 if no user on request", async () => {
      const req = {
        body: { vehicleId, startDate: "2026-08-05", endDate: "2026-08-07" },
        user: undefined,
      } as unknown as Request;
      const res = mockResponse();

      await bookingController.createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("getMyBookings", () => {
    test("should return 200 with bookings for logged in user", async () => {
      const req = { user: { id: customerId } } as unknown as Request;
      const res = mockResponse();

      await bookingController.getMyBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(Array.isArray(jsonArg.data)).toBe(true);
    });

    test("should return 401 if no user on request", async () => {
      const req = { user: undefined } as unknown as Request;
      const res = mockResponse();

      await bookingController.getMyBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("getBookingById", () => {
    test("should return 200 with the booking", async () => {
      const req = { params: { id: bookingId } } as unknown as Request;
      const res = mockResponse();

      await bookingController.getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.data._id.toString()).toBe(bookingId);
    });
  });

  describe("cancelBooking", () => {
    test("should return 200 when cancelling a pending booking", async () => {
      const req = { params: { id: bookingId } } as unknown as Request;
      const res = mockResponse();

      await bookingController.cancelBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.data.status).toBe("cancelled");
    });

    test("should return 400 when cancelling an already cancelled booking", async () => {
      const req = { params: { id: bookingId } } as unknown as Request;
      const res = mockResponse();

      await bookingController.cancelBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(false);
    });
  });
});
