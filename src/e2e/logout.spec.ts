import { expect, Page, test } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const USER_EMAIL = process.env.USER_EMAIL!;
const USER_PASS = process.env.USER_PASS!;
const loginUrl = process.env.LOGIN_URL!;
const flightsearchUrl = process.env.FLIGHTSEARCH_URL!;

test.describe("Logout Flow", () => {

  // Login before each test
  test.beforeEach(async ({ page }) => {
    console.log("LOGINURL", loginUrl);
    await page.goto(loginUrl);

    await page.locator('[data-testid="email-test"]').click();
    await page.locator('[data-testid="email-test"]').fill(USER_EMAIL);

    await page.locator('[data-testid="password"]').click();
    await page.locator('[data-testid="password"]').fill(USER_PASS);
    
    await page.getByRole("button", { name: "Sign In", exact: true }).click();


    await page.waitForURL(/\/flights\/search$/, { timeout: 25000 });
    expect(page.url()).toContain("/flights/search");
  });

  async function performLogout(page: Page) {
    await page.getByRole('button', { name: 'Icon start Profile' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await page.getByTestId('confirm-logout-btn').click();
    await page.waitForURL(loginUrl, { timeout: 25000 });
  }

  // Test 1: Redirect to login page after logout
  test("should redirect to /login after logout", async ({ page }) => {
    await performLogout(page);

    expect(page.url()).toBe(loginUrl);
  });

  // Test 2: Navigation bar should show 'Sign in / Register'
  test("navbar should show Sign in / Register after logout", async ({ page }) => {
    await performLogout(page);

    
    const text = await page.getByRole('button', { name: 'Icon start Sign in / Register' }).innerText();
    expect(text.trim()).toBe("Sign in / Register");
  });

  // Test 3: Protected route should redirect to login
  test("accessing protected /flights/search after logout should redirect to login", async ({ page }) => {
    await performLogout(page);

    // Try to access protected page
    await page.goto(flightsearchUrl);

    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  
  // Test 4: Session cookie should be deleted 
  test("session cookie should be deleted after logout", async ({ page }) => {
    await performLogout(page);

    const cookies = await page.context().cookies();

    // Find next-auth session cookie
    const sessionCookie = cookies.find(
      (c) => c.name.includes("next-auth.session-token")
    );

    // Should not exist
    expect(sessionCookie).toBeUndefined();
  });
});
