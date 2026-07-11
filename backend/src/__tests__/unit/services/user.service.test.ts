import mongoose from "mongoose";
import { UserService } from "../../../services/user.service";
import { UserModel } from "../../../models/user.model";

// Unit tests for UserService - covers logic not already exercised by auth.test.ts
describe("Unit: UserService", () => {
  const userService = new UserService();

  const baseUser = {
    fullName: "User Service Test",
    email: "user-service-test@example.com",
    contactNumber: "9800000004",
    gender: "male" as const,
    password: "password123",
  };

  // keep the original plain-text password separately, since registerUser
  // mutates the passed-in object's password field to the bcrypt hash
  const plainPassword = baseUser.password;

  let userId: string;

  beforeAll(async () => {
    await UserModel.deleteMany({
      email: { $in: [baseUser.email, "user-service-updated@example.com"] },
    });

    const user = await userService.registerUser({ ...baseUser } as any);
    userId = user._id.toString();
  });
  afterAll(async () => {
    await UserModel.deleteMany({
      email: { $in: [baseUser.email, "user-service-updated@example.com"] },
    });
  });

  test("should get user by id", async () => {
    const user = await userService.getUserById(userId);
    expect(user).toBeDefined();
    expect(user.email).toBe(baseUser.email);
  });

  test("should throw 404 for non-existing user id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(userService.getUserById(fakeId)).rejects.toThrow(
      "User not found",
    );
  });

  test("should verify correct current password", async () => {
    const result = await userService.checkPassword(userId, baseUser.password);
    expect(result).toBe(true);
  });

  test("should throw error for incorrect current password", async () => {
    await expect(
      userService.checkPassword(userId, "wrongpassword"),
    ).rejects.toThrow("Current password is incorrect");
  });

  test("should throw 404 when checking password for non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(
      userService.checkPassword(fakeId, baseUser.password),
    ).rejects.toThrow("User not found");
  });

  test("should update user profile fields", async () => {
    const updated = await userService.updateUser(userId, {
      fullName: "User Service Test Updated",
    } as any);
    expect(updated.fullName).toBe("User Service Test Updated");
  });

  test("should update email when it's not a duplicate", async () => {
    const updated = await userService.updateUser(userId, {
      email: "user-service-updated@example.com",
    } as any);
    expect(updated.email).toBe("user-service-updated@example.com");
  });

  test("should throw error when updating to an existing email", async () => {
    // create a second user to collide with
    const otherUser = await userService.registerUser({
      fullName: "Other User",
      email: "other-user-test@example.com",
      contactNumber: "9800000005",
      gender: "female" as const,
      password: "password123",
    } as any);

    await expect(
      userService.updateUser(userId, {
        email: "other-user-test@example.com",
      } as any),
    ).rejects.toThrow("Email already exists");

    await UserModel.deleteOne({ _id: otherUser._id });
  });

  test("should strip currentPassword before saving", async () => {
    const updated = await userService.updateUser(userId, {
      fullName: "Final Name",
      currentPassword: "shouldNotBeSaved",
    } as any);
    expect((updated as any).currentPassword).toBeUndefined();
  });

  test("should throw 404 when updating non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(
      userService.updateUser(fakeId, { fullName: "Doesn't Matter" } as any),
    ).rejects.toThrow("User not found");
  });
});
