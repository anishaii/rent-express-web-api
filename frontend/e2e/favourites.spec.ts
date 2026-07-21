import { test, expect } from "@playwright/test";
import { testUser } from "./test-data";
import { login } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });

test.describe("Favourites page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUser.email, testUser.password);
  });

  test("should add a vehicle to favourites and see it listed", async ({
    page,
  }) => {
    await page.goto("/vehicles", { waitUntil: "networkidle" });

    const card = page
      .locator("div.group", { hasNot: page.getByText("Unavailable") })
      .first();
    const vehicleName = await card
      .getByRole("heading", { level: 3 })
      .textContent();
    const heartButton = card.locator("button").first();

    await heartButton.click();

    // the vehicle might already be favourited from a previous test run -
    // if so, this click removed it, so click again to add it back
    const addedToast = page.getByText("Added to favourites!");
    const removedToast = page.getByText("Removed from favourites");

    const wasRemoved = await removedToast.isVisible().catch(() => false);
    if (wasRemoved) {
      await heartButton.click();
    }

    await expect(addedToast).toBeVisible();

    await page.goto("/favourites", { waitUntil: "networkidle" });
    await expect(
      page.getByRole("heading", { name: "My Favourites" }),
    ).toBeVisible();
    await expect(page.getByText(vehicleName || "")).toBeVisible();
  });

  test("should navigate to vehicle detail page when clicking a favourite", async ({
    page,
  }) => {
    await page.goto("/favourites", { waitUntil: "networkidle" });

    const firstFavourite = page.getByText("Book Now").first();
    await firstFavourite.click();

    await page.waitForURL(/\/vehicles\/.+/);
    await expect(page.getByText("Vehicle Specifications")).toBeVisible();
  });

  test("should remove a vehicle from favourites", async ({ page }) => {
    await page.goto("/favourites", { waitUntil: "networkidle" });

    // the favourite card has exactly two buttons: "Book Now" and the trash icon
    await page
      .getByRole("button", { name: "Book Now" })
      .locator("..")
      .getByRole("button")
      .last()
      .click();

    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("Removed from favourites")).toBeVisible();
  });

  test("should show empty state when no favourites remain", async ({
    page,
  }) => {
    await page.goto("/favourites", { waitUntil: "networkidle" });

    await expect(page.getByText("No favourites yet")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Browse Vehicles" }),
    ).toBeVisible();
  });

  test("should navigate to vehicles page from empty state", async ({
    page,
  }) => {
    await page.goto("/favourites", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Browse Vehicles" }).click();
    await page.waitForURL("/vehicles");
  });
});

test.describe("Favourites page - logged out", () => {
  test("should show favourites page with empty state when not logged in", async ({
    page,
  }) => {
    await page.goto("/favourites", { waitUntil: "networkidle" });
    await expect(
      page.getByRole("heading", { name: "My Favourites" }),
    ).toBeVisible();
    await expect(page.getByText("No favourites yet")).toBeVisible();
  });
});
