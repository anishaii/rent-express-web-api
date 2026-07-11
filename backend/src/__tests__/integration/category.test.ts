import request from "supertest";
import app from "../../app";
import { CategoryModel } from "../../models/category.model";
import { UserModel } from "../../models/user.model";

// Integration tests for the Category API (public + admin)
describe("Category API Integration Tests", () => {
  const adminUser = {
    fullName: "Category Admin Test",
    email: "category-admin-test@example.com",
    contactNumber: "9800000007",
    gender: "male",
    password: "password123",
  };

  let adminToken: string;

  beforeAll(async () => {
    await UserModel.deleteOne({ email: adminUser.email });
    await CategoryModel.deleteMany({ name: "Van" });

    // register then manually promote to admin, since register always creates role "user"
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
    await CategoryModel.deleteMany({ name: "Van" });
  });

  describe("GET /api/category (public)", () => {
    test("should return categories without auth", async () => {
      const res = await request(app).get("/api/category");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/admin/category/create", () => {
    test("should reject request without auth token", async () => {
      const res = await request(app)
        .post("/api/admin/category/create")
        .send({ name: "Van", description: "test" });

      expect(res.statusCode).toBe(401);
    });

    test("should create a category with valid admin token", async () => {
      const res = await request(app)
        .post("/api/admin/category/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Van", description: "test category via integration" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Van");
    });

    test("should reject duplicate category name", async () => {
      const res = await request(app)
        .post("/api/admin/category/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Van", description: "duplicate attempt" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
