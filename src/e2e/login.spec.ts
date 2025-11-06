import { expect, test } from "@playwright/test";
import dotenv from "dotenv";

// Load variables from .env file into process.env
dotenv.config();

const requiredEnv = [ "USER_EMAIL", "USER_PASS", "ADMIN_EMAIL", "ADMIN_PASS", "LOGIN_URL", "FLIGHTSEARCH_URL", "ADMINDASHBOARD_URL", ];

const missing = requiredEnv.filter((k) => !process.env[k] || process.env[k] === ""); 
if (missing.length) { 
    throw new Error(`Missing required env vars: ${missing.join(", ")}. Add them to your .env or CI secrets.`);
}

const USER_EMAIL = process.env.USER_EMAIL!; 
const USER_PASS = process.env.USER_PASS!; 
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!; 
const ADMIN_PASS = process.env.ADMIN_PASS!; 
const loginUrl = process.env.LOGIN_URL!; 
const flightsearchUrl = process.env.FLIGHTSEARCH_URL!; 
const admindashboardUrl = process.env.ADMINDASHBOARD_URL!;

test.describe("Login Flow", () => {
    test("TC1: Render Login page successfully", async ({ page }) => {
        await page.goto(loginUrl);
        await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
        await expect(
            page.getByPlaceholder("Enter your password"),
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Sign In", exact: true }),
        ).toBeVisible(); // exact: true for playwright to ignore other btn.
    });

    test("TC2: Empty required fileds", async ({ page }) => {
        await page.goto(loginUrl);
        await page
            .getByRole("button", { name: "Sign In", exact: true })
            .click();
        await expect(page.getByText("Invalid Email or Password")).toBeVisible();
    });

    test("TC3: Password visibility", async ({ page }) => {
        await page.goto(loginUrl);
        const passwordInput = page.getByPlaceholder("Enter your password");
        const toggleButton = page.locator("div.cursor-pointer").first();

        await expect(passwordInput).toHaveAttribute("type", "password");

        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute("type", "text");
    });

    test("TC4: Invalid credentials", async ({ page }) => {
        await page.goto(loginUrl);
        await page
            .getByPlaceholder("Enter your email")
            .fill("wrong@example.com");
        await page.getByPlaceholder("Enter your password").fill("wrongpass");
        await page
            .getByRole("button", { name: "Sign In", exact: true })
            .click();
        await expect(page.getByText("Invalid Email or Password")).toBeVisible();
    });

    test("TC5: valid User login", async ({ page }) => {
        await page.goto(loginUrl);
        await page.getByPlaceholder("Enter your email").fill(USER_EMAIL);
        await page.getByPlaceholder("Enter your password").fill(USER_PASS);
        await page
            .getByRole("button", { name: "Sign In", exact: true })
            .click();

        await page.waitForURL(flightsearchUrl);
        expect(page.url()).toContain("/flights/search");
    });

    test("TC6: valid Admin login", async ({ page }) => {
        await page.goto(loginUrl);
        await page.getByPlaceholder("Enter your email").fill(ADMIN_EMAIL);
        await page.getByPlaceholder("Enter your password").fill(ADMIN_PASS);
        await page
            .getByRole("button", { name: "Sign In", exact: true })
            .click();

        await page.waitForURL(admindashboardUrl);
        expect(page.url()).toContain("/dashboard");
    });
});
