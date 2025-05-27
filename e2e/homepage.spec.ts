import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check page title
  await expect(page).toHaveTitle(/Jabin Web/);

  // Check main navigation
  await expect(page.locator('nav')).toBeVisible();

  // Check hero section
  await expect(page.locator('h1')).toBeVisible();

  // Check that the page is responsive
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('nav')).toBeVisible();
});

test('navigation works correctly', async ({ page }) => {
  await page.goto('/');

  // Test navigation to services page
  await page.click('text=Services');
  await expect(page).toHaveURL(/.*services/);

  // Test navigation to portfolio
  await page.click('text=Portfolio');
  await expect(page).toHaveURL(/.*portfolio/);
});
