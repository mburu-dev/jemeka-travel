import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should complete a booking successfully', async ({ page }) => {
    // 1. Navigate to destinations
    await page.goto('/destinations');
    
    // 2. Click on the first destination (assuming one exists)
    await page.locator('text=Explore Destination').first().click();
    
    // 3. Click on the first package in that destination
    await page.locator('text=Available Tour Packages').scrollIntoViewIfNeeded();
    await page.locator('.group.hover\\:shadow-lg').first().click();
    
    // 4. Click "Book This Tour" to show form
    await page.click('text=Book This Tour');
    
    // 5. Fill out the form
    await page.fill('input#travelDate', '2026-12-25');
    await page.fill('input#adults', '2');
    await page.fill('input#children', '1');
    await page.fill('input#name', 'Test User');
    await page.fill('input#email', 'test@example.com');
    
    // 6. Submit the form
    await page.click('button:has-text("Confirm Booking")');
    
    // 7. Check for success toast/message
    // Using sonner toast check
    await expect(page.locator('text=Booking submitted successfully')).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('/packages');
    await page.locator('.group.overflow-hidden').first().click();
    await page.click('text=Book This Tour');
    
    await page.fill('input#name', 'Test User');
    await page.fill('input#email', 'invalid-email');
    await page.click('button:has-text("Confirm Booking")');
    
    // HTML5 validation or application validation check
    const emailInput = page.locator('input#email');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });
});
