import request from "supertest";
import app from "../../app";
import { BrandModel } from "../../models/brand.model";
import { UserModel } from "../../models/user.model";

// Integration tests for the Brand API (public + admin)
describe("Brand API Integration Tests", () => {
  const adminUser = {
    fullName: "Brand Admin Test",
    email: "brand-admin-test@example.com",
    contactNumber: "9800000008",
    gender: "male",
    password: "password123",
  };

  let adminToken: string;

  beforeAll(async () => {
    await UserModel.deleteOne({ email: adminUser.email });
    await BrandModel.deleteMany({ name: "Test Integration Brand" });

    await request(app).post("/api/auth/register").send(adminUser);
    await UserModel.updateOne({ email: adminUser.email }, { role: "admin" });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: adminUser.email });
    await BrandModel.deleteMany({ name: "Test Integration Brand" });
  });

  describe("GET /api/brand (public)", () => {
    test("should return brands without auth", async () => {
      const res = await request(app).get("/api/brand");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/admin/brand/create", () => {
    test("should reject request without auth token", async () => {
      const res = await request(app)
        .post("/api/admin/brand/create")
        .send({ name: "Test Integration Brand" });

      expect(res.statusCode).toBe(401);
    });

    test("should create a brand with valid admin token", async () => {
      const res = await request(app)
        .post("/api/admin/brand/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test Integration Brand" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Test Integration Brand");
    });

    test("should reject duplicate brand name", async () => {
      const res = await request(app)
        .post("/api/admin/brand/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test Integration Brand" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
