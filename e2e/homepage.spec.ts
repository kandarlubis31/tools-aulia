import { test, expect } from '@playwright/test';

test.describe('ToolsAulia Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Tools/);

    // Check main heading is visible
    const heading = page.locator('h1');
    await expect(heading.first()).toBeVisible();

    // Check that tool categories are loaded
    const categories = page.locator('a[href^="/pdf"], a[href^="/image"], a[href^="/dev"]');
    await expect(categories.first()).toBeVisible();
  });

  test('should be able to search for tools', async ({ page }) => {
    // Find and click search button
    const searchBtn = page.locator('#search-btn');
    await searchBtn.click();

    // Search modal should appear
    const searchModal = page.locator('#search-modal');
    await expect(searchModal).toBeVisible();

    // Type in search input
    const searchInput = page.locator('#search-modal-input');
    await searchInput.fill('pdf');

    // Should show search results
    await expect(page.locator('#search-results')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('#theme-toggle-desktop');
    
    // Click to toggle theme
    await themeToggle.click();
    
    // Check that dark class is added to html element
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should toggle language', async ({ page }) => {
    // Find language toggle button
    const langToggle = page.locator('#lang-toggle-desktop');
    
    // Get initial language label
    const langLabel = page.locator('#lang-label-desktop');
    const initialLang = await langLabel.textContent();
    
    // Click to toggle language
    await langToggle.click();
    
    // Language should change
    const newLang = await langLabel.textContent();
    expect(newLang).not.toBe(initialLang);
  });

  test('should navigate to PDF tools', async ({ page }) => {
    // Click PDF Tools link
    await page.locator('a[href="/pdf"]').click();
    
    // Should be on PDF tools page
    await expect(page).toHaveURL(/\/pdf/);
    
    // Should show PDF tools content
    await expect(page.locator('text=PDF')).toBeVisible();
  });

  test('should be accessible - keyboard navigation', async ({ page }) => {
    // Tab to search button
    await page.keyboard.press('Tab');
    
    // Focus should be visible on search button
    const searchBtn = page.locator('#search-btn');
    await expect(searchBtn).toBeFocused();
  });
});

test.describe('PDF Tools Page', () => {
  test('should load PDF tools page', async ({ page }) => {
    await page.goto('/pdf');
    
    // Check page loads
    await expect(page).toHaveTitle(/PDF/);
    
    // Check tool cards are visible - use proper selector
    const toolCards = page.locator('a[href^="/pdf/"]');
    await expect(toolCards.first()).toBeVisible({ timeout: 10000 });
  });
});