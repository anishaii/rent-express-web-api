import { test, expect } from "@playwright/test";
import { testUser } from "./test-data";
import { login, logout } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });
test.describe("Authentication flow", () => {
  test("should register a new user successfully", async ({ page }) => {
    const uniqueEmail = `e2e-register-${Date.now()}@example.com`;

    await page.goto("/register");
    await page.getByPlaceholder("Enter your full name").fill("New E2E User");
    await page.getByPlaceholder("Enter your email").fill(uniqueEmail);
    await page.getByPlaceholder("Enter your contact number").fill("9800000099");
    await page.getByRole("radio", { name: "Male", exact: true }).check();
    await page.getByPlaceholder("Enter your password").fill("TestPass123!");
    await page.getByPlaceholder("Confirm your password").fill("TestPass123!");
    await page.getByRole("button", { name: "Register" }).click();

    await page.waitForURL("/login", { timeout: 5000 });
  });

  test("should show validation error for invalid email format", async ({
    page,
  }) => {
    await page.goto("/register");
    await page
      .getByPlaceholder("Enter your full name")
      .fill("Invalid Email Test");
    await page.getByPlaceholder("Enter your email").fill("not-an-email");
    await page.getByPlaceholder("Enter your contact number").fill("9800000099");
    await page.getByRole("radio", { name: "Male", exact: true }).check();
    await page.getByPlaceholder("Enter your password").fill("TestPass123!");
    await page.getByPlaceholder("Confirm your password").fill("TestPass123!");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL(/register/);
  });
  test("should show error when passwords do not match on register", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.getByPlaceholder("Enter your full name").fill("Mismatch Test");
    await page
      .getByPlaceholder("Enter your email")
      .fill(`e2e-mismatch-${Date.now()}@example.com`);
    await page.getByPlaceholder("Enter your contact number").fill("9800000099");
    await page.getByRole("radio", { name: "Male", exact: true }).check();
    await page.getByPlaceholder("Enter your password").fill("TestPass123!");
    await page
      .getByPlaceholder("Confirm your password")
      .fill("DifferentPass456!");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test("should log in with valid credentials", async ({ page }) => {
    await login(page, testUser.email, testUser.password);
    await expect(page.getByText(testUser.fullName)).toBeVisible();
  });

  test("should show error for invalid password", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Enter your email").fill(testUser.email);
    await page.getByPlaceholder("Enter your password").fill("wrongpassword123");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/invalid password/i)).toBeVisible();
  });

  test("should show error for non-existent email", async ({ page }) => {
    await page.goto("/login");
    await page
      .getByPlaceholder("Enter your email")
      .fill("doesnotexist@example.com");
    await page.getByPlaceholder("Enter your password").fill("anypassword");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test("should log out successfully", async ({ page }) => {
    await login(page, testUser.email, testUser.password);
    await logout(page, testUser.fullName);
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Login" }),
    ).toBeVisible();
  });

  test("should navigate to forgot password page from login", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByText(/forgot password/i).click();
    await page.waitForURL("/forgot-password");
  });
});
