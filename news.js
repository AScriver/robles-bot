const Parser = require('rss-parser');
const parser = new Parser();

/**
 * Fetch top stories from a list of RSS feed URLs.
 * @param {string[]} sources Array of RSS feed URLs.
 * @param {number} limit Number of stories per source.
 * @returns {Promise<Object>} An object keyed by source title with arrays of {title, link}.
 */
async function fetchTopStories(sources, limit = 3) {
  const results = {};
  for (const url of sources) {
    try {
      const feed = await parser.parseURL(url);
      const title = feed.title || url;
      results[title] = feed.items.slice(0, limit).map(item => ({title: item.title, link: item.link}));
    } catch (err) {
      console.error('Failed to parse RSS feed', url, err);
    }
  }
  return results;
}

module.exports = fetchTopStories;
