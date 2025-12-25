// services/googleSearch.js
import puppeteer from 'puppeteer';

/**
 * Search Google and return top results
 */
export async function searchGoogle(query) {
  let browser;
  
  try {
    console.log(`   Searching for: "${query}"`);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent(
      process.env.USER_AGENT || 
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    );

    // Navigate to Google Search
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for results to load
    await page.waitForSelector('div#search', { timeout: 10000 });

    // Extract search results
    const results = await page.evaluate(() => {
      const items = [];
      
      // Select organic search result elements
      const resultElements = document.querySelectorAll('div.g');
      
      for (const element of resultElements) {
        const linkElement = element.querySelector('a');
        const titleElement = element.querySelector('h3');
        
        if (linkElement && titleElement) {
          const url = linkElement.href;
          const title = titleElement.textContent;
          
          // Filter out non-article URLs (PDFs, videos, social media, etc.)
          if (
            url && 
            title &&
            !url.includes('youtube.com') &&
            !url.includes('facebook.com') &&
            !url.includes('twitter.com') &&
            !url.includes('.pdf') &&
            !url.includes('google.com')
          ) {
            items.push({ url, title });
          }
        }
      }
      
      return items;
    });

    console.log(`   Found ${results.length} relevant results`);
    return results;

  } catch (error) {
    console.error('Error during Google search:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Alternative search method using direct HTTP (fallback)
 */
export async function searchGoogleSimple(query) {
  try {
    const axios = (await import('axios')).default;
    const cheerio = (await import('cheerio')).default;
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('div.g').each((i, element) => {
      const $element = $(element);
      const link = $element.find('a').first().attr('href');
      const title = $element.find('h3').first().text();

      if (link && title && !link.includes('google.com')) {
        results.push({ url: link, title });
      }
    });

    return results;
  } catch (error) {
    console.error('Simple search failed:', error.message);
    return [];
  }
}
