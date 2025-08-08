jest.mock('rss-parser', () => {
  return jest.fn().mockImplementation(() => ({
    parseURL: jest.fn(async url => ({
      title: `Feed for ${url}`,
      items: [
        {title: `${url} story1`, link: `${url}/1`},
        {title: `${url} story2`, link: `${url}/2`}
      ]
    }))
  }));
});

const fetchTopStories = require('../news');

describe('fetchTopStories', () => {
  it('returns limited stories for each source', async () => {
    const result = await fetchTopStories(['http://a', 'http://b'], 1);
    expect(result['Feed for http://a']).toEqual([
      {title: 'http://a story1', link: 'http://a/1'}
    ]);
    expect(result['Feed for http://b']).toEqual([
      {title: 'http://b story1', link: 'http://b/1'}
    ]);
  });
});
