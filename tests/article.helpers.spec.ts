import { test, expect } from '@playwright/test';
import getArticle, {
  getSibling,
  getId,
  getRank,
  getUrl,
  getTitle,
  getScore,
  getBy,
  getAge,
} from '../src/helpers/article';
import { BASE_URL } from '../src/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test.describe.serial('getSibling()', () => {
  test('should be attached', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const articleRowSibling = getSibling(articleRow);
    await expect(articleRowSibling).toBeAttached();
  });
  test('returns only one locator', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const articleRowSibling = getSibling(articleRow);
    const count = await articleRowSibling.count();
    expect(count).toBe(1);
  });
  test('has no class attribute', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const articleRowSibling = getSibling(articleRow);
    const classAttribute = await articleRowSibling.getAttribute('class');
    expect(classAttribute).toBeNull();
  });
});

test.describe.serial('getId()', () => {
  test('returns a string for article id', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const id = await getId(articleRow);
    expect(typeof id).toBe('string');
  });
  test('returns a non-empty string for article id', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const id = await getId(articleRow);
    expect(id.length).toBeGreaterThanOrEqual(1);
  });
});

test.describe.serial('getRank()', () => {
  test('returns a number for article rank', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const rank = await getRank(articleRow);
    expect(typeof rank).toBe('number');
  });
  test('returns a valid article rank', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const rank = await getRank(articleRow);
    expect(rank).toBe(1);
  });
});

test.describe.serial('getUrl()', () => {
  test('returns a string for article url', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const url = await getUrl(articleRow);
    expect(typeof url).toBe('string');
  });
  test('returns a valid article url', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const url = await getUrl(articleRow);
    expect(() => new URL(url)).not.toThrow();
  });
});

test.describe.serial('getTitle()', () => {
  test('returns a string for article title', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const title = await getTitle(articleRow);
    expect(typeof title).toBe('string');
  });

  test('returns a valid article title', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const title = await getTitle(articleRow);
    expect(title.length).toBeGreaterThan(1);
  });
});

test.describe.serial('getScore()', () => {
  test('returns a number for article score', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const score = await getScore(articleRow);
    expect(typeof score).toBe('number');
  });
});

test.describe.serial('getBy()', () => {
  test('returns a string for article author', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const by = await getBy(articleRow);
    expect(typeof by).toBe('string');
  });
  test('returns a non-empty string for article author', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const by = await getBy(articleRow);
    expect(by.length).toBeGreaterThanOrEqual(1);
  });
});

test.describe.serial('getAge()', () => {
  test('returns a string for article age', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const age = await getAge(articleRow);
    expect(typeof age).toBe('string');
  });

  test('returns a non-empty string for article age', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const age = await getAge(articleRow);
    expect(age.length).toBeGreaterThanOrEqual(1);
  });

  test('returns a valid date for article age', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(0);
    const age = await getAge(articleRow);
    const date = new Date(age);
    expect(!isNaN(date.getTime())).toBe(true);
  });
});

test.describe.serial('getArticle()', () => {
  test('returns an object for the article', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(5);
    const article = await getArticle(articleRow);
    expect(typeof article).toBe('object');
  });
  test('returns the correct article rank', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(5);
    const article = await getArticle(articleRow);
    expect(article.rank).toBe(6);
  });
  test('has all of the necessary properties', async ({ page }) => {
    const articleRow = page.locator('tr.athing').nth(5);
    const article = await getArticle(articleRow);
    expect(article).toHaveProperty('id');
    expect(article).toHaveProperty('rank');
    expect(article).toHaveProperty('url');
    expect(article).toHaveProperty('title');
    expect(article).toHaveProperty('score');
    expect(article).toHaveProperty('by');
    expect(article).toHaveProperty('age');
  });
});
