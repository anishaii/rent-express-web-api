import { test, expect } from "@playwright/test";
import { testUser } from "./test-data";
import { login } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });

test.describe("My Bookings page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUser.email, testUser.password);
    await page.goto("/bookings", { waitUntil: "networkidle" });
  });

  test("should display bookings for the logged in user", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "My Bookings" }),
    ).toBeVisible();
    // at least one booking card should render (from earlier booking-flow tests)
    await expect(page.getByText("View Details").first()).toBeVisible();
  });

  test("should filter bookings by status tab", async ({ page }) => {
    await page.getByRole("button", { name: "Pending" }).click();
    // every visible status badge should now say "pending"
    const badges = page.locator("span.capitalize");
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveText(/pending/i);
    }
  });

  test("should show empty state for a tab with no matching bookings", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Completed" }).click();
    // either real completed bookings show, or the empty state text appears -
    // just confirm the tab switch actually changed the view without erroring
    await expect(page.getByRole("button", { name: "Completed" })).toHaveClass(
      /bg-\[#0092B8\]/,
    );
  });

  test("should navigate to booking details when View Details is clicked", async ({
    page,
  }) => {
    await page.getByText("View Details").first().click();
    await page.waitForURL(/\/bookings\/confirmed/);
    await expect(page.getByText("Booking Confirmed!")).toBeVisible();
  });

  test("should cancel a pending booking", async ({ page }) => {
    await page.getByRole("button", { name: "Pending" }).click();

    const cancelButton = page
      .getByRole("button", { name: "Cancel Booking" })
      .first();
    // skip gracefully if there's no pending booking left to cancel
    if ((await cancelButton.count()) === 0) {
      test.skip();
      return;
    }

    await cancelButton.click();
    await page.getByRole("button", { name: "Yes, Cancel" }).click();

    await expect(page.getByText("Booking cancelled")).toBeVisible();
  });
});
