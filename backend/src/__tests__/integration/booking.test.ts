import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { VehicleModel } from "../../models/vehicle.model";
import { BrandModel } from "../../models/brand.model";
import { CategoryModel } from "../../models/category.model";
import { BookingModel } from "../../models/booking.model";

// Integration tests for the Booking API
describe("Booking API Integration Tests", () => {
  const testUser = {
    fullName: "Booking Integration User",
    email: "booking-integration@example.com",
    contactNumber: "9800000002",
    gender: "male",
    password: "password123",
  };

  let token: string;
  let vehicleId: string;
  let bookingId: string;

  beforeAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
    await VehicleModel.deleteMany({ name: "Integration Test Vehicle" });
    await BookingModel.deleteMany({});

    // register and login to get a real JWT
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = loginRes.body.data.token;

    // create a real vehicle to book
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
      name: "Integration Test Vehicle",
      brandId: brand._id,
      categoryId: category._id,
      pricePerDay: 800,
      fuelType: "Petrol",
      seats: 4,
      transmission: "Manual",
      description: "test vehicle for booking integration",
      isAvailable: true,
    });
    vehicleId = vehicle._id.toString();
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
    await VehicleModel.deleteMany({ name: "Integration Test Vehicle" });
    await BookingModel.deleteMany({});
  });

  describe("POST /api/booking/create", () => {
    test("should reject request without auth token", async () => {
      const res = await request(app).post("/api/booking/create").send({
        vehicleId,
        startDate: "2026-08-01",
        endDate: "2026-08-03",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test("should create a booking with valid data", async () => {
      const res = await request(app)
        .post("/api/booking/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          vehicleId,
          startDate: "2026-08-01",
          endDate: "2026-08-03",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalPrice).toBe(1600); // 2 days * 800
      bookingId = res.body.data._id;
    });

    test("should reject booking with missing fields", async () => {
      const res = await request(app)
        .post("/api/booking/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ vehicleId });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/booking/my-bookings", () => {
    test("should get all bookings for logged in user", async () => {
      const res = await request(app)
        .get("/api/booking/my-bookings")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("should reject request without auth token", async () => {
      const res = await request(app).get("/api/booking/my-bookings");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/booking/:id", () => {
    test("should get a single booking by id", async () => {
      const res = await request(app)
        .get(`/api/booking/${bookingId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(bookingId);
    });
  });

  describe("PUT /api/booking/cancel/:id", () => {
    test("should cancel a pending booking", async () => {
      const res = await request(app)
        .put(`/api/booking/cancel/${bookingId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should not cancel an already cancelled booking", async () => {
      const res = await request(app)
        .put(`/api/booking/cancel/${bookingId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
