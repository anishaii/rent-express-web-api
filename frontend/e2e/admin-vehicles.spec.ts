import { test, expect } from "@playwright/test";
import { testAdmin } from "./test-data";
import { login } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });

const testVehicleName = `E2E Test Vehicle ${Date.now()}`;

test.describe("Admin vehicle management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testAdmin.email, testAdmin.password);
    await page.goto("/dashboard/vehicles", { waitUntil: "networkidle" });
  });

  test("should display the vehicle management table", async ({ page }) => {
    await expect(page.getByPlaceholder("Search vehicles...")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add Vehicle" }),
    ).toBeVisible();
    await expect(page.getByText("Vehicle Name")).toBeVisible();
  });
  test("should search for a vehicle", async ({ page }) => {
    await page.getByPlaceholder("Search vehicles...").fill("Honda");
    await page.waitForURL(/search=Honda/);
    await expect(page.getByText(/Honda/i).first()).toBeVisible();
  });

  test("should show validation error when creating vehicle with empty fields", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Vehicle" }).click();
    await page.waitForURL("/dashboard/vehicles/new");

    await page.getByRole("button", { name: "Save Vehicle" }).click();

    await expect(page.getByText("Vehicle name is required")).toBeVisible();
  });

  test("should create a new vehicle", async ({ page }) => {
    await page.getByRole("button", { name: "Add Vehicle" }).click();
    await page.waitForURL("/dashboard/vehicles/new");

    await page.getByLabel("Vehicle Name").fill(testVehicleName);

    await page.getByText("Select brand").click();
    await page.getByRole("option").first().click();

    await page.getByText("Select category").click();
    await page.getByRole("option").first().click();

    await page
      .getByLabel("Description")
      .fill("Created by an automated E2E test.");
    await page.getByLabel("Price Per Day (NPR)").fill("999");
    await page.getByLabel("Seats").fill("4");

    await page.getByText("Select fuel type").click();
    await page.getByRole("option", { name: "Petrol" }).click();

    await page.getByText("Select transmission").click();
    await page.getByRole("option", { name: "Manual" }).click();

    await page.getByRole("button", { name: "Save Vehicle" }).click();

    await page.waitForURL("/dashboard/vehicles");
    await expect(page.getByText("Vehicle created successfully!")).toBeVisible();
    await expect(page.getByText(testVehicleName)).toBeVisible();
  });

  test("should toggle vehicle availability", async ({ page }) => {
    const row = page.getByRole("row", { name: new RegExp(testVehicleName) });
    const toggle = row.getByRole("switch");

    const wasChecked = await toggle.isChecked();
    await toggle.click();

    await expect(
      page.getByText(
        wasChecked
          ? "Vehicle marked as unavailable"
          : "Vehicle marked as available",
      ),
    ).toBeVisible();
  });

  test("should edit the vehicle", async ({ page }) => {
    const row = page.getByRole("row", { name: new RegExp(testVehicleName) });
    await row.locator("button").nth(2).click(); // edit (pencil) - switch is nth(0), view is nth(1)
    await page.waitForURL(/\/dashboard\/vehicles\/edit\/.+/);

    const nameInput = page.getByLabel("Vehicle Name");
    await nameInput.fill(`${testVehicleName} Updated`);

    await page.getByRole("button", { name: "Update Vehicle" }).click();

    await page.waitForURL("/dashboard/vehicles");
    await expect(page.getByText("Vehicle updated successfully!")).toBeVisible();
    await expect(page.getByText(`${testVehicleName} Updated`)).toBeVisible();
  });

  test("should delete the vehicle", async ({ page }) => {
    const row = page.getByRole("row", {
      name: new RegExp(`${testVehicleName} Updated`),
    });
    await row.locator("button").last().click(); // delete (trash) is the last action button

    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("Vehicle deleted successfully")).toBeVisible();
    await expect(
      page.getByText(`${testVehicleName} Updated`),
    ).not.toBeVisible();
  });
});
