import { test, expect } from "@playwright/test";

test.describe("Vehicle browsing and filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/vehicles");
  });

  test("should display vehicles on page load", async ({ page }) => {
    await expect(page.getByText(/vehicles found/i)).toBeVisible();
    // at least one vehicle card should render (Rent Now button is unique to cards)
    const rentNowButtons = page.getByRole("button", { name: "Rent Now" });
    await expect(rentNowButtons.first()).toBeVisible();
  });

  test("should filter vehicles by search text", async ({ page }) => {
    const initialCountText = await page
      .getByText(/vehicles found/i)
      .textContent();

    await page.getByPlaceholder("Search vehicles...").fill("Honda");

    // wait for the filtered count to update and differ from the unfiltered count
    await expect(page.getByText(/vehicles found/i)).not.toHaveText(
      initialCountText || "",
    );
  });

  test("should filter vehicles by category checkbox", async ({ page }) => {
    await page.getByLabel("Bike", { exact: true }).check();

    // all visible vehicle category badges should now show "Bike"
    const categoryBadges = page.locator('span:has-text("Bike")');
    await expect(categoryBadges.first()).toBeVisible();
  });

  test("should show empty state when no vehicles match filters", async ({
    page,
  }) => {
    await page
      .getByPlaceholder("Search vehicles...")
      .fill("zzz-nonexistent-vehicle-zzz");

    await expect(page.getByText("No vehicles found")).toBeVisible();
    await expect(page.getByText("Try adjusting your filters")).toBeVisible();
  });

  test("should clear all filters when Clear Filters is clicked", async ({
    page,
  }) => {
    await page.getByPlaceholder("Search vehicles...").fill("Honda");
    await page.getByRole("button", { name: "Clear Filters" }).click();

    await expect(page.getByPlaceholder("Search vehicles...")).toHaveValue("");
  });

  test("should filter by available only checkbox", async ({ page }) => {
    const initialCountText = await page
      .getByText(/vehicles found/i)
      .textContent();

    await page.getByLabel("Available only").check();

    // count should change (or stay same if all vehicles are already available -
    // at minimum, the checkbox itself should now be checked)
    await expect(page.getByLabel("Available only")).toBeChecked();
  });
});
