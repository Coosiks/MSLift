import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Accept disclaimer in localStorage and enable offline mode if needed
  await page.addInitScript(() => {
    localStorage.setItem('mslift_disclaimer_accepted', 'true');
    localStorage.setItem('mslift_offline_mode', 'true');
  });
});

test.describe('MSLift E2E Tests', () => {
  test('1. Загрузка каталога программ', async ({ page }) => {
    await page.goto('/programs');

    // Check heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Программы тренировок');

    // Check programs counter and catalog elements
    await expect(page.getByText('Всего программ в базе')).toBeVisible();
    const programCards = page.locator('.glass-panel');
    await expect(programCards.first()).toBeVisible();
  });

  test('2. Расчёт 1ПМ (формула Эпли) с проверкой результата', async ({ page }) => {
    await page.goto('/calculator');

    // Check heading
    await expect(page.locator('h1')).toContainText('Калькулятор 1ПМ');

    // Set weight: 100 kg, reps: 5 (Formula: 100 * (1 + 5/30) = 116.7)
    const weightInput = page.locator('input[placeholder="100"]');
    const repsInput = page.locator('input[placeholder="5"]');

    await weightInput.fill('100');
    await repsInput.fill('5');

    // Verify calculated 1RM
    const resultValue = page.locator('.text-5xl');
    await expect(resultValue).toHaveText('116.7');

    // Change to weight: 120 kg, reps: 5 (Formula: 120 * (1 + 5/30) = 140)
    await weightInput.fill('120');
    await expect(resultValue).toHaveText('140');
  });

  test('3. Переключение темы и сохранение в localStorage', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.locator('button[aria-label*="тему"]').first();
    await expect(themeButton).toBeVisible();

    // Initial check (dark by default)
    const initialTheme = await page.evaluate(() => localStorage.getItem('mslift_theme') || 'dark');

    // Toggle theme
    await themeButton.click();
    const newTheme = initialTheme === 'dark' ? 'light' : 'dark';

    await expect(page.locator('html')).toHaveClass(new RegExp(newTheme));
    const storedTheme = await page.evaluate(() => localStorage.getItem('mslift_theme'));
    expect(storedTheme).toBe(newTheme);

    // Toggle back
    await themeButton.click();
    await expect(page.locator('html')).toHaveClass(new RegExp(initialTheme));
    const revertedTheme = await page.evaluate(() => localStorage.getItem('mslift_theme'));
    expect(revertedTheme).toBe(initialTheme);
  });

  test('4. Навигация между страницами', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');

    const nav = page.locator('nav');

    // Navigate to Programs
    await nav.getByRole('link', { name: 'Программы' }).click();
    await expect(page).toHaveURL(/\/programs/);
    await expect(page.locator('h1')).toContainText('Программы тренировок');

    // Navigate to 1RM Calculator
    await nav.getByRole('link', { name: '1ПМ' }).click();
    await expect(page).toHaveURL(/\/calculator/);
    await expect(page.locator('h1')).toContainText('Калькулятор 1ПМ');

    // Navigate to Workout Diary
    await nav.getByRole('link', { name: 'Дневник', exact: true }).click();
    await expect(page).toHaveURL(/\/workouts/);

    // Navigate to Nutrition Calculator
    await nav.getByRole('link', { name: 'Норма КБЖУ' }).click();
    await expect(page).toHaveURL(/\/nutrition-calculator/);
  });

  test('5. Добавление записи в дневник (offline)', async ({ page }) => {
    await page.goto('/workouts');

    // Fill workout notes
    const testNote = `Тестовая тренировка Playwright e2e ${Date.now()}`;
    const notesInput = page.locator('textarea[placeholder*="Хороший драйв"]');
    await notesInput.fill(testNote);

    // Submit workout to diary
    const saveButton = page.getByRole('button', { name: 'Записать тренировку в дневник' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Verify note is saved and visible in history
    await expect(page.getByText(testNote)).toBeVisible();
  });
});
