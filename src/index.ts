import { chromium, type Page, type Locator } from '@playwright/test';
import type Article from './types/article';
import { BASE_URL, MAX_ARTICLES } from './constants';
import getArticle from './helpers/article';

/**
 * Attempts to navigate to the next page.
 *
 * @param {Page} page - A Playwright `Page` instance.
 * @returns {Promise<void>} A `Promise` that resolves once navigation is complete.
 */
export const more = async (page: Page): Promise<void> => {
  const moreButton = page.locator('a.morelink');
  await moreButton.click();
  await page.waitForSelector('a.morelink');
};

/**
 * Verifies the articles are sorted by date.
 *
 * @param {Article[]} articles
 * @returns {Boolean} True if articles are sorted by date.
 */
export const verifyArticleDatesSorted = (articles: Article[]): Boolean => {
  // If theres more than 1 article,
  if (articles.length > 1) {
    for (let i = 1; i < articles.length; i++) {
      // Check if next article's date is later or the same as the previous one.
      if (new Date(articles[i].age) >= new Date(articles[i - 1].age)) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Attempts to get articles up to limit.
 *
 * @param {Page} page - A Playwright `Page` instance.
 * @param {number} limit - Maxmimum number of articles to get.
 * @returns {Promise<Article[]>} A `Promise` that resolves to the array of articles.
 */
export const getArticles = async (
  page: Page,
  limit: number
): Promise<Article[]> => {
  const articles = [];

  // while limit not reached
  while (articles.length <= limit && limit > 0) {
    const articleRows = page.locator('tr.athing');
    const count = await articleRows.count();

    // for each article on page
    for (let i = 0; i < count; i++) {
      const article = await getArticle(articleRows.nth(i));
      articles.push(article);

      // stop if limit reached
      if (articles.length == limit) break;
    }

    // stop if limit reached else load more articles
    if (articles.length == limit) break;
    await more(page);
  }

  return articles;
};

/**
 * Attempts to get articles and verifies they're sorted.
 *
 * @returns {Promise<{ articles: Article[]; isSorted: Boolean; }>}
 */
const sortHackerNewsArticles = async (): Promise<{
  articles: Article[];
  isSorted: Boolean;
}> => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(BASE_URL);

  const articles = await getArticles(page, MAX_ARTICLES);
  const isSorted = verifyArticleDatesSorted(articles);
  browser.close();
  return { articles, isSorted };
};

(async () => {
  const { articles, isSorted } = await sortHackerNewsArticles();
  console.log(articles);
  console.log(`Are articles sorted?: ${isSorted ? '✅' : '❌'}`);
})();

export default sortHackerNewsArticles;
