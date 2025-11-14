import { test, expect } from '@playwright/test';

// Helper to build a unique email per run (avoid conflicts if backend enforces uniqueness)
function uniqueEmail() {
	return `user_${Date.now()}_${Math.floor(Math.random()*1000)}@example.com`;
}

test.describe('Registration Flow', () => {
	test('TC1-1: happy path with validation checks', async ({ page }) => {
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

	test('TC1-2: privacy policy link navigates correctly from password step', async ({ page }) => {
		await page.goto('/registration/password');
		await page.getByTestId('registration-password-privacy-link').click();
		await expect(page).toHaveURL(/.*\/registration\/privacyPolicy$/);
		await expect(page.getByText(/Privacy Policy/i)).toBeVisible();
	});

	// New test: verify back buttons navigate correctly through the flow
	test('TC1-3: back buttons navigate to previous steps', async ({ page }) => {
		// Start at first step
		await page.goto('/registration/email');
		// Enter valid email and proceed
		const email = uniqueEmail();
		await page.getByTestId('registration-email-input').fill(email);
		await page.getByTestId('registration-email-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);

		// Click Back on name step -> email step
		await page.getByTestId('registration-name-back-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/email$/);

		// Proceed again to name step (email should persist)
		await page.getByTestId('registration-email-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);

		// Fill names and go forward
		await page.getByTestId('registration-first-name-input').fill('John');
		await page.getByTestId('registration-last-name-input').fill('Doe');
		await page.getByTestId('registration-name-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);

		// Back from password -> name, verify values persisted
		await page.getByTestId('registration-password-back-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);
		await expect(page.getByTestId('registration-first-name-input')).toHaveValue('John');
		await expect(page.getByTestId('registration-last-name-input')).toHaveValue('Doe');

		// Forward again to password
		await page.getByTestId('registration-name-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);

		// Fill matching strong password and proceed
		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/terms$/);

		// Back from terms -> password
		await page.getByTestId('registration-terms-back-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);

		// (Optional) Proceed again to terms to ensure navigation still works
		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/terms$/);
	});

	// New test: password requirement validations
	test('TC1-4: password requirement validations', async ({ page }) => {
		await page.goto('/registration/password');
		await page.waitForLoadState('networkidle');
		// Sanity: requirement hints rendered
		await expect(page.getByTestId('registration-password-req-length')).toBeVisible();
		await expect(page.getByTestId('registration-password-req-capital')).toBeVisible();
		await expect(page.getByTestId('registration-password-req-number-symbol')).toBeVisible();

		// Case 1: Fails length only (has capital + number)
		await page.getByTestId('registration-password-input').fill('A1!');
		await page.getByTestId('registration-confirm-password-input').fill('A1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);
		await expect(page.getByTestId('registration-password-req-length')).toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-capital')).not.toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-number-symbol')).not.toHaveClass(/text-error-main/);

		// Case 2: Fails capital only
		await page.getByTestId('registration-password-input').fill('abcd1234!');
		await page.getByTestId('registration-confirm-password-input').fill('abcd1234!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-length')).not.toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-capital')).toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-number-symbol')).not.toHaveClass(/text-error-main/);

		// Case 3: Fails number/symbol only
		await page.getByTestId('registration-password-input').fill('Abcdefgh');
		await page.getByTestId('registration-confirm-password-input').fill('Abcdefgh');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-length')).not.toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-capital')).not.toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-number-symbol')).toHaveClass(/text-error-main/);

		// Case 4: Fails length + capital
		await page.getByTestId('registration-password-input').fill('abc1!');
		await page.getByTestId('registration-confirm-password-input').fill('abc1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-length')).toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-capital')).toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-number-symbol')).not.toHaveClass(/text-error-main/);

		// Case 5: Fails capital + number/symbol
		await page.getByTestId('registration-password-input').fill('abcdefgh');
		await page.getByTestId('registration-confirm-password-input').fill('abcdefgh');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-length')).not.toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-capital')).toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-number-symbol')).toHaveClass(/text-error-main/);

		// Case 6: Fails length + number/symbol
		await page.getByTestId('registration-password-input').fill('Abc');
		await page.getByTestId('registration-confirm-password-input').fill('Abc');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-length')).toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-capital')).not.toHaveClass(/text-error-main/);
		await expect(page.getByTestId('registration-password-req-number-symbol')).toHaveClass(/text-error-main/);

		// Case 7: All pass -> proceed to terms
		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/terms$/);
	});
});

