import { test, expect } from '@playwright/test';

// Helper to build a unique email per run (avoid conflicts if backend enforces uniqueness)
function uniqueEmail() {
	return `user_${Date.now()}_${Math.floor(Math.random()*1000)}@example.com`;
}

test.describe('Registration Flow', () => {
	// TC1-1: Invalid Email (missing @)
	test('TC1-1: invalid email shows browser validation', async ({ page }) => {
		await page.goto('/registration/email');
		const emailInput = page.getByTestId('registration-email-input');
		await emailInput.fill('invalid');
		await page.getByTestId('registration-email-next-btn').click();
		const validationMessage = await emailInput.evaluate((el) => (el as HTMLInputElement).validationMessage);
		await expect(validationMessage).toContain("Please include an '@' in the email address. 'invalid' is missing an '@'.");
	});

	// TC1-2: Valid Email
	test('TC1-2: valid email navigates to name step', async ({ page }) => {
		await page.goto('/registration/email');
		await page.getByTestId('registration-email-input').fill('example@gmail.com');
		await page.getByTestId('registration-email-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);
	});

	// TC1-3: Empty First/Last Name
	test('TC1-3: empty names show validation', async ({ page }) => {
		await page.goto('/registration/name');
		await page.getByTestId('registration-name-next-btn').click();
		await expect(page.getByText('First name must be at least 2 characters')).toBeVisible();
		await expect(page.getByText('Last name must be at least 2 characters')).toBeVisible();
	});

	// TC1-4: Valid Name
	test('TC1-4: valid names navigate to password step', async ({ page }) => {
		await page.goto('/registration/name');
		await page.getByTestId('registration-first-name-input').fill('John');
		await page.getByTestId('registration-last-name-input').fill('Doe');
		await page.getByTestId('registration-name-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);
	});

	// TC1-5: Passwords not match
	test('TC1-5: passwords mismatch shows error', async ({ page }) => {
		await page.goto('/registration/password');
		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('Different1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByText('Passwords not match')).toBeVisible();
	});

	// TC1-6: Strong Password (passes all) -> Terms
	test('TC1-6: strong password navigates to terms', async ({ page }) => {
		await page.goto('/registration/password');
		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/terms$/);
	});

	// TC1-7: Terms not accepted
	test('TC1-7: terms next disabled until accepted', async ({ page }) => {
		await page.goto('/registration/terms');
		const nextBtn = page.getByTestId('registration-terms-next-btn');
		await expect(nextBtn).toBeDisabled();
	});

	// TC1-8: Terms accepted -> Success
	test('TC1-8: accept terms navigates to success', async ({ page }) => {
		await page.route('**/api/v1/auth/register', async (route) => {
			route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
		});
		await page.goto('/registration/terms');
		const nextBtn = page.getByTestId('registration-terms-next-btn');
		await page.getByTestId('registration-terms-checkbox').check();
		await expect(nextBtn).toBeEnabled();
		await nextBtn.click();
		await expect(page).toHaveURL(/.*\/registration\/success$/);
		await expect(page.getByTestId('registration-success-panel')).toBeVisible();
	});

	// TC1-9: Privacy Policy link
	test('TC1-9: privacy policy link navigates', async ({ page }) => {
		await page.goto('/registration/password');
		await page.getByTestId('registration-password-privacy-link').click();
		await expect(page).toHaveURL(/.*\/registration\/privacyPolicy$/);
		await expect(page.getByText(/Privacy Policy/i)).toBeVisible();
	});

	// TC1-10: Back button behavior
	test('TC1-10: back buttons navigate and retain values', async ({ page }) => {
		await page.goto('/registration/email');
		const email = uniqueEmail();
		await page.getByTestId('registration-email-input').fill(email);
		await page.getByTestId('registration-email-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);

		await page.getByTestId('registration-name-back-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/email$/);
		await page.getByTestId('registration-email-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);

		await page.getByTestId('registration-first-name-input').fill('John');
		await page.getByTestId('registration-last-name-input').fill('Doe');
		await page.getByTestId('registration-name-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);

		await page.getByTestId('registration-password-back-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/name$/);
		await expect(page.getByTestId('registration-first-name-input')).toHaveValue('John');
		await expect(page.getByTestId('registration-last-name-input')).toHaveValue('Doe');

		await page.getByTestId('registration-name-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);

		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/terms$/);

		await page.getByTestId('registration-terms-back-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/password$/);
	});

	// TC1-11: Weak Password - length fails
	test('TC1-11: weak password fails length', async ({ page }) => {
		await page.goto('/registration/password');
		await page.waitForLoadState('networkidle');
		await expect(page.getByTestId('registration-password-req-length')).toBeVisible();
		await page.getByTestId('registration-password-input').fill('A1!');
		await page.getByTestId('registration-confirm-password-input').fill('A1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-length')).toHaveClass(/text-error-main/);
	});

	// TC1-12: Weak Password - capital fails
	test('TC1-12: weak password fails capital', async ({ page }) => {
		await page.goto('/registration/password');
		await page.waitForLoadState('networkidle');
		await expect(page.getByTestId('registration-password-req-capital')).toBeVisible();
		await page.getByTestId('registration-password-input').fill('abcd1234!');
		await page.getByTestId('registration-confirm-password-input').fill('abcd1234!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-capital')).toHaveClass(/text-error-main/);
	});

	// TC1-13: Weak Password - number/symbol fails
	test('TC1-13: weak password fails number or symbol', async ({ page }) => {
		await page.goto('/registration/password');
		await page.waitForLoadState('networkidle');
		await expect(page.getByTestId('registration-password-req-number-symbol')).toBeVisible();
		await page.getByTestId('registration-password-input').fill('Abcdefgh');
		await page.getByTestId('registration-confirm-password-input').fill('Abcdefgh');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page.getByTestId('registration-password-req-number-symbol')).toHaveClass(/text-error-main/);
	});

	// TC1-14: Strong Password (passes all) -> Terms
	test('TC1-14: strong password navigates to terms', async ({ page }) => {
		await page.goto('/registration/password');
		await page.getByTestId('registration-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-confirm-password-input').fill('StrongPass1!');
		await page.getByTestId('registration-password-next-btn').click();
		await expect(page).toHaveURL(/.*\/registration\/terms$/);
	});
});

