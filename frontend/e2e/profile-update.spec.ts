import { test, expect } from "@playwright/test";
import { testUser } from "./test-data";
import { login } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });

test.describe("Profile update", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUser.email, testUser.password);
    await page.goto("/profile", { waitUntil: "networkidle" });
  });

  test("should display current profile information", async ({ page }) => {
    await expect(page.getByLabel("Full Name")).toHaveValue(testUser.fullName);
    await expect(page.getByLabel("Email")).toHaveValue(testUser.email);
  });

  test("should enable editing when Edit Profile is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Edit Profile" }).click();
    await expect(page.getByLabel("Full Name")).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Save Changes" }),
    ).toBeVisible();
  });

  test("should update full name successfully", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Profile" }).click();

    const nameInput = page.getByLabel("Full Name");
    await nameInput.fill("User Test Updated");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Profile updated successfully!")).toBeVisible();

    // revert back so other tests/batches relying on testUser.fullName stay consistent
    await page.getByRole("button", { name: "Edit Profile" }).click();
    await page.getByLabel("Full Name").fill(testUser.fullName);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Profile updated successfully!")).toBeVisible();
  });

  test("should cancel editing without saving changes", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Profile" }).click();
    await page.getByLabel("Full Name").fill("This Should Not Save");
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(
      page.getByRole("button", { name: "Edit Profile" }),
    ).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Full Name")).toHaveValue(testUser.fullName);
  });
});
