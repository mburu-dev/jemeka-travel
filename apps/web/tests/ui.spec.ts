import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 13'] });

  test('homepage looks good on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check if mobile menu button is visible
    const menuButton = page.locator('button[aria-label="Open menu"], .lucide-menu');
    await expect(menuButton).toBeVisible();
    
    // Check if hero text is readable (not overflowing)
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    
    // Open menu
    await menuButton.click();
    await expect(page.locator('text=Destinations')).toBeVisible();
  });
});

test.describe('Desktop Navigation', () => {
  test('navigation bar is sticky', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Check if header has scrolled class or white background
    const header = page.locator('header');
    await expect(header).toHaveClass(/bg-white/);
  });
});
