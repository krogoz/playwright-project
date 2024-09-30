/**
 * Represents the data of an article on `https://news.ycombinator.com/newest`.
 *
 * @interface
 * @example
 * const article: Article = {
 *  id: '41618389',
 *  rank: 100,
 *  url: 'https://chipsandcheese.com/2024/09/22/intels-redwood-cove-baby-steps-are-still-steps/',
 *  title: "Intel's Redwood Cove: Baby Steps Are Still Steps",
 *  score: 4,
 *  by: 'pella',
 *  age: '2024-09-22T17:13:42.000000Z'
 * }
 */
interface Article {
  /**
   * The article's unique id.
   */
  id: string;
  /**
   * The article's position on the page.
   */
  rank: number;
  /**
   * The article's URL.
   */
  url: string;
  /**
   * The article's title.
   */
  title: string;
  /**
   * The articles score or votes.
   */
  score: number;
  /**
   * The id of the user who posted the article.
   */
  by: string;
  /**
   * The article's creation date.
   */
  age: string;
}

export default Article;
