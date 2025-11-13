import { test, expect } from '@playwright/test';

// Helper to build a unique email per run (avoid conflicts if backend enforces uniqueness)
function uniqueEmail() {
	return `user_${Date.now()}_${Math.floor(Math.random()*1000)}@example.com`;
}

test.describe('Registration Flow', () => {
	test('happy path with validation checks', async ({ page }) => {
		// Intercept registration API to avoid depending on backend state
		await page.route('**/api/v1/auth/register', async (route) => {
			route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
		});

		// Start at email page
		await page.goto('/registration/email');

		// Try invalid email
		const emailInput = page.getByTestId('registration-email-input');
		await emailInput.fill('invalid');
		await page.getByTestId('registration-email-next-btn').click();
		// Assert native browser validation message (Thai locale as in UI)
		const validationMessage = await emailInput.evaluate((el) => (el as HTMLInputElement).validationMessage);
		await expect(validationMessage).toContain("Please include an '@' in the email address. 'invalid' is missing an '@'.");

		// Enter valid email
		const email = uniqueEmail();
		await page.getByTestId('registration-email-input').fill(email);
		await page.getByTestId('registration-email-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);

		// Name step - leave blank to trigger errors
		await page.getByTestId('registration-name-next-btn').click();
		await expect(page.getByText("First name must be at least 2 characters")).toBeVisible();
		await expect(page.getByText("Last name must be at least 2 characters")).toBeVisible();

		// Fill names
		await page.getByTestId('registration-first-name-input').fill('John');
		await page.getByTestId('registration-last-name-input').fill('Doe');
		await page.getByTestId('registration-name-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);

		// Password step - mismatch first
		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('Different1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByText('Passwords not match')).toBeVisible();

		// Correct confirm password
		await page.getByTestId('registration-confirm-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/terms$/);

		// Terms step - Next disabled until checked
		const nextBtn = page.getByTestId('registration-terms-next-btn');
		await expect(nextBtn).toBeDisabled();
		await page.getByTestId('registration-terms-checkbox').check();
		await expect(nextBtn).toBeEnabled();
		await nextBtn.click();

		// Success page
		await expect(page).toHaveURL(/.*\/registration\/success$/);
		await expect(page.getByTestId('registration-success-panel')).toBeVisible();
		await expect(page.getByText(/Successfully Signed Up/i)).toBeVisible();
	});

	test('privacy policy link navigates correctly from password step', async ({ page }) => {
		await page.goto('/registration/password');
		await page.getByTestId('registration-password-privacy-link').click();
		await expect(page).toHaveURL(/.*\/registration\/privacyPolicy$/);
		await expect(page.getByText(/Privacy Policy/i)).toBeVisible();
	});
});

