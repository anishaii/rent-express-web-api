import { Page } from "@playwright/test";

// logs in a user through the actual login form and waits for redirect
export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /login/i }).click();

  // wait until we've navigated away from /login as confirmation of success
  await page.waitForURL((url) => !url.pathname.includes("/login"), {
    timeout: 5000,
  });
  await page.waitForTimeout(1000);
}

// logs out via the UserMenu dropdown -> Logout -> confirm dialog
// fullName must match the logged-in user's name shown in the dropdown trigger
export async function logout(page: Page, fullName: string) {
  // the dropdown trigger button shows the user's full name
  await page.getByRole("button", { name: new RegExp(fullName, "i") }).click();
  await page.getByText("Logout", { exact: true }).click();
  // confirm inside the AlertDialog - the action button also says "Logout"
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Logout" })
    .click();
  await page.waitForURL("/");
}
