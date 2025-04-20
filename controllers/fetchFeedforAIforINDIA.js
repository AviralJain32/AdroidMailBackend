// pages/api/news.js
import Parser from 'rss-parser';

const parser = new Parser();

export default async function fetchFeed(req, res) {
  try {
    const techCrunchFeed = await parser.parseURL('https://techcrunch.com/category/artificial-intelligence/feed/');
    const wsjFeed = await parser.parseURL('https://feeds.a.dj.com/rss/RSSWorldNews.xml'); 

    // Combine and format the feeds as needed
    const combinedFeed = [...techCrunchFeed.items, ...wsjFeed.items].map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      source: item.link.includes('techcrunch.com') ? 'TechCrunch' : 'WSJ',
    }));

    res.status(200).json(combinedFeed);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch RSS feeds : '+error });
  }
}
