import { Locator } from '@playwright/test';
import { BASE_URL } from '../constants';
import type Article from '../types/article';
import articleSchema from '../schemas/articleSchema';

/**
 * Attempts to get the article id.
 *
 * @param {Locator} articleRow
 * @returns {Promise<Article['id']>}
 */
export const getId = async (articleRow: Locator): Promise<Article['id']> => {
  return (await articleRow.getAttribute('id')) || '';
};

/**
 * Attempts to get the article rank.
 *
 * @param {Locator} articleRow
 * @returns {Promise<Article['rank']>}
 */
export const getRank = async (
  articleRow: Locator
): Promise<Article['rank']> => {
  const rank = await articleRow.locator('span.rank').innerText();
  return Number(rank.slice(0, -1));
};

/**
 * Attempts to get the article url.
 *
 * @param {Locator} articleRow
 * @returns {Promise<Article['url']>}
 */
export const getUrl = async (articleRow: Locator): Promise<Article['url']> => {
  const url =
    (await articleRow.locator('span.titleline > a').getAttribute('href')) || '';

  if (url.startsWith('item?id=')) {
    return new URL(url, BASE_URL).toString();
  }

  return url;
};

/**
 * Attempts to get the article title.
 *
 * @param {Locator} articleRow
 * @returns {Promise<Article['title']>}
 */
export const getTitle = async (
  articleRow: Locator
): Promise<Article['title']> => {
  return await articleRow.locator('span.titleline > a').innerText();
};

/**
 * Attempts to get the article score.
 *
 * @param {Locator} articleRow
 * @returns {Promise<Article['score']>}
 */
export const getScore = async (
  articleRow: Locator
): Promise<Article['score']> => {
  const articleRowSibling = getSibling(articleRow);
  const scoreText = await articleRowSibling.locator('span.score').innerText();
  return Number(scoreText.split(' ')[0]);
};

/**
 * Attempts to get the article author.
 *
 * @param {Locator} articleRow
 * @returns {Promise<Article['by']>}
 */
export const getBy = async (articleRow: Locator): Promise<Article['by']> => {
  const articleRowSibling = getSibling(articleRow);
  return await articleRowSibling.locator('a.hnuser').innerText();
};

/**
 * Attempts to get the article age.
 *
 * @param {Locator} articleRow
 * @returns {Promise<Article['age']>}
 */
export const getAge = async (articleRow: Locator): Promise<Article['age']> => {
  const articleRowSibling = getSibling(articleRow);
  return (
    (await articleRowSibling.locator('span.age').getAttribute('title')) || ''
  );
};

/**
 * Gets articleRow sibling `Locator`.
 *
 * @param {Locator} articleRow
 * @returns {Locator} articleRowSibling
 */
export const getSibling = (articleRow: Locator): Locator => {
  return articleRow.locator('xpath=/following-sibling::tr').first();
};

/**
 * Attempts to get all the data associated with an article.
 *
 * @param articleRow
 * @returns {Promise<Article>}
 */
const getArticle = async (articleRow: Locator): Promise<Article> => {
  // Get article data
  const [id, rank, url, title, score, by, age] = await Promise.all([
    getId(articleRow),
    getRank(articleRow),
    getUrl(articleRow),
    getTitle(articleRow),
    getScore(articleRow),
    getBy(articleRow),
    getAge(articleRow),
  ]);

  // Parse article data
  const result = articleSchema.safeParse({
    id,
    rank,
    url,
    title,
    score,
    by,
    age,
  });

  // Throw on error
  if (!result.success) {
    throw Error(result.error.format().toString());
  }

  // Return article
  return result.data;
};

export default getArticle;
