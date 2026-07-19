import { test, expect } from "@playwright/test";
import { testUser } from "./test-data";
import { login } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });

function getAvailableVehicleHeading(page: import("@playwright/test").Page) {
  return page
    .locator("div.group", { hasNot: page.getByText("Unavailable") })
    .getByRole("heading", { level: 3 })
    .first();
}

test.describe("Vehicle detail page", () => {
  test("should navigate to vehicle detail page from listing", async ({
    page,
  }) => {
    await page.goto("/vehicles", { waitUntil: "networkidle" });

    const heading = getAvailableVehicleHeading(page);
    const vehicleName = await heading.textContent();

    await heading.click();
    await page.waitForURL(/\/vehicles\/.+/);
    await expect(
      page.getByRole("heading", { level: 1, name: vehicleName || "" }),
    ).toBeVisible();
  });

  test("should display vehicle specifications", async ({ page }) => {
    await page.goto("/vehicles", { waitUntil: "networkidle" });

    await getAvailableVehicleHeading(page).click();
    await page.waitForURL(/\/vehicles\/.+/);

    await expect(page.getByText("Vehicle Specifications")).toBeVisible();
    await expect(page.getByText("Pickup Location")).toBeVisible();
  });

  test("should show login dialog when favouriting while logged out", async ({
    page,
  }) => {
    await page.goto("/vehicles", { waitUntil: "networkidle" });

    await getAvailableVehicleHeading(page).click();
    await page.waitForURL(/\/vehicles\/.+/);

    await page.getByRole("button", { name: "Book Now" }).click();
    await expect(page.getByText("Login Required")).toBeVisible();
  });

  test("should add and remove a vehicle from favourites when logged in", async ({
    page,
  }) => {
    await login(page, testUser.email, testUser.password);
    await page.goto("/vehicles", { waitUntil: "networkidle" });

    const card = page
      .locator("div.group", { hasNot: page.getByText("Unavailable") })
      .first();
    const heartButton = card.locator("button").first();

    await heartButton.click();
    await expect(page.getByText("Added to favourites!")).toBeVisible();

    await heartButton.click();
    await expect(page.getByText("Removed from favourites")).toBeVisible();
  });

  test("should persist a favourited vehicle on the favourites page", async ({
    page,
  }) => {
    await login(page, testUser.email, testUser.password);
    await page.goto("/vehicles");
    await page.getByRole("button", { name: "Rent Now" }).first().waitFor();

    const card = page
      .locator("div.group", { hasNot: page.getByText("Unavailable") })
      .first();
    const heartButton = card.locator("button").first();
    await heartButton.click();
    await expect(page.getByText("Added to favourites!")).toBeVisible();

    await page.goto("/favourites");
    await expect(page.getByText(/favourite/i)).toBeVisible();

    await page.goto("/vehicles");
    await heartButton.click();
  });
});
