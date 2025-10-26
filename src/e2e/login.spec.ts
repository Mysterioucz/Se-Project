import { expect, test } from "@playwright/test";

const USER_EMAIL = "usertest@gmail.com";
const USER_PASS = "Thisisuser001";
// TODO: Add Admin email & password from backend
const ADMIN_EMAIL = "";
const ADMIN_PASS = "";
const loginUrl = "http://localhost:3000/login";
const flightsearchUrl = "http://localhost:3000/flights/search";
const admindashboardUrl = "http://localhost:3000/admin/dashboard";

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
        await page.getByRole("button", { name: "Sign In", exact: true }).click();
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
        await page.getByRole("button", { name: "Sign In", exact: true }).click();
        await expect(page.getByText("Invalid Email or Password")).toBeVisible();
    });

    test("TC5: valid User login", async ({ page }) => {
        await page.goto(loginUrl);
        await page.getByPlaceholder("Enter your email").fill(USER_EMAIL);
        await page.getByPlaceholder("Enter your password").fill(USER_PASS);
        await page.getByRole("button", { name: "Sign In", exact: true }).click();

        await page.waitForURL(flightsearchUrl);
        expect(page.url()).toContain("/flights/search");
    });

    //   test("TC6: valid Admin login", async ({ page }) => {
    //     await page.goto(loginUrl);
    //     await page.getByPlaceholder("Enter your email").fill(ADMIN_EMAIL);
    //     await page.getByPlaceholder("Enter your password").fill(ADMIN_PASS);
    //     await page.getByRole("button", { name: "Sign In" }).click();

    //     await page.waitForURL(admindashboardUrl);
    //     expect(page.url()).toContain("/admin/dashboard");
    //   });
});
