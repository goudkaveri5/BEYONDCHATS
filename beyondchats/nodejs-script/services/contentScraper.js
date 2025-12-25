// services/contentScraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrape article content from a URL
 */
export async function scrapeArticleContent(url) {
  try {
    console.log(`      Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 20000
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('script, style, nav, header, footer, iframe, noscript').remove();
    $('.advertisement, .ads, .social-share').remove();

    // Try multiple selectors to find main content
    const selectors = [
      'article',
      'main',
      '[role="main"]',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      '#content',
      '.post-body'
    ];

    let content = '';
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        content = element.text();
        if (content.length > 500) {
          break;
        }
      }
    }

    // Fallback: get all paragraphs
    if (content.length < 500) {
      const paragraphs = [];
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 50) {
          paragraphs.push(text);
        }
      });
      content = paragraphs.join('\n\n');
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    if (content.length < 200) {
      throw new Error('Insufficient content extracted');
    }

    console.log(`      Extracted ${content.length} characters`);
    return content;

  } catch (error) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
}

/**
 * Extract metadata from a webpage
 */
export async function extractMetadata(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    return {
      title: $('title').text() || 
             $('meta[property="og:title"]').attr('content') || 
             $('h1').first().text(),
      description: $('meta[name="description"]').attr('content') || 
                   $('meta[property="og:description"]').attr('content'),
      author: $('meta[name="author"]').attr('content') || 
              $('[rel="author"]').text(),
      publishedDate: $('meta[property="article:published_time"]').attr('content') ||
                     $('time').attr('datetime')
    };
  } catch (error) {
    return null;
  }
}
