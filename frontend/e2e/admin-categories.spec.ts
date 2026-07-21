import { test, expect } from "@playwright/test";
import { testAdmin } from "./test-data";
import { login } from "./utils/auth-helpers";

test.describe.configure({ mode: "serial" });

test.describe("Admin category management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testAdmin.email, testAdmin.password);
    await page.goto("/dashboard/categories", { waitUntil: "networkidle" });
  });

  test("should display the category management table", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Category Management" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add Category" }),
    ).toBeVisible();
    await expect(page.getByText("Bike")).toBeVisible();
  });

  test("should open the add category dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Add Category" }).click();
    await expect(
      page.getByRole("dialog").getByText("Add New Category"),
    ).toBeVisible();
  });

  test("should show validation error when no category is selected on create", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Category" }).click();
    await page.getByLabel("Description").fill("Some description");
    await page.getByRole("button", { name: "Create Category" }).click();

    await expect(page.getByText("Please select a category")).toBeVisible();
  });

  test("should cancel the dialog without saving", async ({ page }) => {
    await page.getByRole("button", { name: "Add Category" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Cancel" })
      .click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should show validation error for empty description on create", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Category" }).click();

    await page.getByText("Select category").click();
    await page.getByRole("option").first().click();
    // deliberately leave description empty

    await page.getByRole("button", { name: "Create Category" }).click();
    await expect(page.getByText("Description is required")).toBeVisible();
  });

  test("should edit a category description and revert it back", async ({
    page,
  }) => {
    const row = page.getByRole("row", { name: /^Bike/ });
    const originalDescription = await row.locator("td").nth(1).textContent();

    await row.locator("button").first().click(); // edit (pencil) button

    const descriptionInput = page.getByLabel("Description");
    await descriptionInput.fill("Temporary E2E test description");
    await page.getByRole("button", { name: "Update Category" }).click();

    await expect(
      page.getByText("Category updated successfully!"),
    ).toBeVisible();
    await expect(
      page.getByText("Temporary E2E test description"),
    ).toBeVisible();

    // revert back to the original description
    const updatedRow = page.getByRole("row", { name: /^Bike/ });
    await updatedRow.locator("button").first().click();
    await page.getByLabel("Description").fill(originalDescription || "");
    await page.getByRole("button", { name: "Update Category" }).click();

    await expect(
      page.getByText("Category updated successfully!"),
    ).toBeVisible();
  });
});
