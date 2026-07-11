import { Request, Response } from "express";
import { UserController } from "../../../controllers/user.controller";
import { UserModel } from "../../../models/user.model";
import { UserService } from "../../../services/user.service";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Unit tests for UserController - mocks req/res, uses real service and test DB
describe("Unit: UserController", () => {
  const userController = new UserController();
  const userService = new UserService();

  let userId: string;

  beforeAll(async () => {
    await UserModel.deleteMany({ email: "user-controller-test@example.com" });

    const user = await userService.registerUser({
      fullName: "User Controller Test",
      email: "user-controller-test@example.com",
      contactNumber: "9800000006",
      gender: "male",
      password: "password123",
    } as any);
    userId = user._id.toString();
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: "user-controller-test@example.com" });
  });

  describe("whoami", () => {
    test("should return 200 with the logged in user", async () => {
      const req = {
        user: { _id: userId, email: "user-controller-test@example.com" },
      } as unknown as Request;
      const res = mockResponse();

      await userController.whoami(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(true);
    });

    test("should return 401 if no user on request", async () => {
      const req = { user: undefined } as unknown as Request;
      const res = mockResponse();

      await userController.whoami(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("updateUser", () => {
    test("should return 200 and update profile fields", async () => {
      const req = {
        user: { _id: userId },
        body: { fullName: "Updated Via Controller" },
        file: undefined,
      } as unknown as Request;
      const res = mockResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.data.fullName).toBe("Updated Via Controller");
    });

    test("should return 401 if no user on request", async () => {
      const req = {
        user: undefined,
        body: { fullName: "Doesn't Matter" },
      } as unknown as Request;
      const res = mockResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    test("should return 400 for invalid update data", async () => {
      const req = {
        user: { _id: userId },
        body: { gender: "not-a-valid-gender" },
        file: undefined,
      } as unknown as Request;
      const res = mockResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
      expect(jsonArg.success).toBe(false);
    });
  });
});
