import { test, expect } from '@playwright/test';
import * as index from '../src/index';
import getArticle from '../src/helpers/article';
import { BASE_URL } from '../src/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test.describe('page', () => {
  test('navigates to Hacker News and verifies the title', async ({ page }) => {
    await expect(page).toHaveTitle('New Links | Hacker News');
  });
});

test.describe.serial('articleRow Locator', () => {
  test('returns all article rows on the page', async ({ page }) => {
    const articleRows = page.locator('tr.athing');
    const articleRowsCount = await articleRows.count();
    expect(articleRowsCount).toBe(30);
  });
  test('returns a single article row', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const articleRowCount = await articleRow.count();
    expect(articleRowCount).toBe(1);
  });
});

test.describe('more()', () => {
  test('navigates to the next page on click', async ({ page }) => {
    await index.more(page);
    const pageUrl = page.url();
    expect(pageUrl.includes('n=31')).toBeTruthy();
  });
});

test.describe.serial('getArticles()', () => {
  test('returns 1 article when the limit is 1', async ({ page }) => {
    const articles = await index.getArticles(page, 1);
    expect(articles.length).toBe(1);
  });

  test('returns 5 articles when the limit is 5', async ({ page }) => {
    const articles = await index.getArticles(page, 5);
    expect(articles.length).toBe(5);
  });

  test('returns 100 articles when the limit is 100', async ({ page }) => {
    const articles = await index.getArticles(page, 100);
    expect(articles.length).toBe(100);
  });

  test('returns 0 articles when the limit is 0', async ({ page }) => {
    const articles = await index.getArticles(page, 0);
    expect(articles.length).toBe(0);
  });

  test('returns 0 articles when the limit is negative', async ({ page }) => {
    const articles = await index.getArticles(page, -1);
    expect(articles.length).toBe(0);
  });
});

test.describe.serial('verifyArticleDatesSorted()', () => {
  test('returns true for an empty articles array', () => {
    const articles = [];
    const result = index.verifyArticleDatesSorted(articles);
    expect(result).toBe(true);
  });

  test('returns true if articles array length is 1', async ({ page }) => {
    const article = await getArticle(page.locator('tr.athing').nth(0));
    const articles = [article];
    const result = index.verifyArticleDatesSorted(articles);
    expect(result).toBe(true);
  });

  test('returns false for unsorted articles array', async ({ page }) => {
    const article1 = await getArticle(page.locator('tr.athing').nth(0));
    const article2 = await getArticle(page.locator('tr.athing').nth(20));

    const articles = [article2, article1];
    const result = index.verifyArticleDatesSorted(articles);
    expect(result).toBe(false);
  });

  test('returns true for sorted articles array', async ({ page }) => {
    const article1 = await getArticle(page.locator('tr.athing').nth(0));
    const article2 = await getArticle(page.locator('tr.athing').nth(1));

    const articles = [article1, article2];
    const result = index.verifyArticleDatesSorted(articles);
    expect(result).toBe(true);
  });
});
