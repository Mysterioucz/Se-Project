import { expect, test } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const USER_EMAIL = process.env.USER_EMAIL!;
const USER_PASS = process.env.USER_PASS!;
const loginUrl = process.env.LOGIN_URL!;
const flightsearchUrl = process.env.FLIGHTSEARCH_URL!;

test.describe("Logout Flow", () => {

  // Log in before each logout test
  test.beforeEach(async ({ page }) => {
    await page.goto(loginUrl);

    await page.getByPlaceholder("Enter your email").fill(USER_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(USER_PASS);

    await page
      .getByRole("button", { name: "Sign In", exact: true })
      .click();

    await page.waitForURL(flightsearchUrl);
    expect(page.url()).toContain("/flights/search");
  });

  //
  test("Precondition: user should be logged in", async ({ page }) => {
    // Optional: verify user-specific elements are visible
    await expect(page.getByText("Welcome")).toBeVisible(); // adjust selector
  });
  
});
