import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Jemeka Tours/);
});

test('navigation links work', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Destinations');
  await expect(page).toHaveURL(/.*destinations/);
});

test('can view destination detail', async ({ page }) => {
  // Assuming there's a destination with slug 'serengeti'
  await page.goto('/destinations/serengeti');
  // Check if heading contains Serengeti
  const heading = page.locator('h1');
  await expect(heading).toContainText(/Serengeti/i);
});
