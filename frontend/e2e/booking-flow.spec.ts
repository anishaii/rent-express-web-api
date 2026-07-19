import { test, expect } from "@playwright/test";
import { testUser } from "./test-data";
import { login } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });

async function pickCalendarDay(
  page: import("@playwright/test").Page,
  dayNumber: number,
) {
  await page
    .getByRole("gridcell", { name: new RegExp(`${dayNumber}(st|nd|rd|th)?,`) })
    .first()
    .getByRole("button")
    .click();
}

// cap pickup so pickup+2 never exceeds a safe day-of-month for any calendar length
function getSafeDates(offsetDays: number) {
  const today = new Date().getDate();
  const pickupDay = Math.min(today + offsetDays, 25);
  const dropoffDay = pickupDay + 2;
  return { pickupDay, dropoffDay };
}

test.describe("Booking flow", () => {
  test("should complete the full booking flow: confirm -> review -> confirmed", async ({
    page,
  }) => {
    await login(page, testUser.email, testUser.password);

    await page.goto("/vehicles", { waitUntil: "networkidle" });
    const card = page
      .locator("div.group", { hasNot: page.getByText("Unavailable") })
      .first();
    await card.click();
    await page.waitForURL(/\/vehicles\/.+/);

    await page.getByRole("button", { name: "Book Now" }).click();
    await page.waitForURL(/\/bookings\/confirm/);

    await expect(page.getByText("Complete Your Booking")).toBeVisible();

    const { pickupDay, dropoffDay } = getSafeDates(3);

    await page.getByRole("button", { name: "mm/dd/yyyy" }).first().click();
    await pickCalendarDay(page, pickupDay);

    await page.getByRole("button", { name: "mm/dd/yyyy" }).last().click();
    await pickCalendarDay(page, dropoffDay);

    await page.getByRole("button", { name: "Confirm Booking" }).click();

    await page.waitForURL(/\/bookings\/review/);
    await expect(
      page.getByRole("heading", { name: "Review Your Booking" }),
    ).toBeVisible();
    await expect(page.getByText("Payment Summary")).toBeVisible();

    await page.getByRole("button", { name: "Confirm & Book" }).click();

    await page.waitForURL(/\/bookings\/confirmed/, { timeout: 10000 });
    await expect(page.getByText("Booking Confirmed!")).toBeVisible();
    await expect(page.getByText("Important Note")).toBeVisible();
  });

  test("should navigate to My Bookings from the confirmed page", async ({
    page,
  }) => {
    await login(page, testUser.email, testUser.password);
    await page.goto("/vehicles", { waitUntil: "networkidle" });

    const card = page
      .locator("div.group", { hasNot: page.getByText("Unavailable") })
      .first();
    await card.click();
    await page.waitForURL(/\/vehicles\/.+/);

    await page.getByRole("button", { name: "Book Now" }).click();
    await page.waitForURL(/\/bookings\/confirm/);

    const { pickupDay, dropoffDay } = getSafeDates(6);

    await page.getByRole("button", { name: "mm/dd/yyyy" }).first().click();
    await pickCalendarDay(page, pickupDay);

    await page.getByRole("button", { name: "mm/dd/yyyy" }).last().click();
    await pickCalendarDay(page, dropoffDay);

    await page.getByRole("button", { name: "Confirm Booking" }).click();
    await page.waitForURL(/\/bookings\/review/);
    await page.getByRole("button", { name: "Confirm & Book" }).click();

    await page.waitForURL(/\/bookings\/confirmed/, { timeout: 10000 });
    await page.getByRole("link", { name: "Go to My Bookings" }).click();
    await page.waitForURL("/bookings");
    await expect(page.getByText("My Bookings")).toBeVisible();
  });

  test("should show validation error if dates are not selected", async ({
    page,
  }) => {
    await login(page, testUser.email, testUser.password);
    await page.goto("/vehicles", { waitUntil: "networkidle" });

    const card = page
      .locator("div.group", { hasNot: page.getByText("Unavailable") })
      .first();
    await card.click();
    await page.waitForURL(/\/vehicles\/.+/);

    await page.getByRole("button", { name: "Book Now" }).click();
    await page.waitForURL(/\/bookings\/confirm/);

    await page.getByRole("button", { name: "Confirm Booking" }).click();

    await expect(
      page.getByText(/please select pickup and drop-off dates/i),
    ).toBeVisible();
  });
});
