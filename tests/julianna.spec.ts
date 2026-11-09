import { test, expect } from '@playwright/test';

test('jogo abre o menu e inicia uma partida sem erro de runtime', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (erro) => erros.push(erro.message));

  await page.goto('http://localhost:4173/');
  await page.click('#excalibur-play');

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  await page.keyboard.press('Digit1');
  await expect(canvas).toBeVisible();

  expect(erros).toEqual([]);
});