// index.js
import 'dotenv/config';
import { fetchLatestArticle, saveEnhancedArticle } from './services/laravelApi.js';
import { searchGoogle } from './services/googleSearch.js';
import { scrapeArticleContent } from './services/contentScraper.js';
import { enhanceArticle } from './services/claudeAI.js';

async function main() {
  console.log('🚀 Starting Article Enhancement Process...\n');

  try {
    // Step 1: Fetch latest article from Laravel API
    console.log('📖 Step 1: Fetching latest article...');
    const originalArticle = await fetchLatestArticle();
    
    if (!originalArticle) {
      console.log('❌ No articles available for enhancement');
      return;
    }
    
    console.log(`✅ Found article: "${originalArticle.title}"\n`);

    // Step 2: Search Google for the article title
    console.log('🔍 Step 2: Searching Google...');
    const searchQuery = originalArticle.title;
    const searchResults = await searchGoogle(searchQuery);
    
    if (searchResults.length < 2) {
      console.log('❌ Not enough search results found');
      return;
    }
    
    console.log(`✅ Found ${searchResults.length} search results\n`);

    // Step 3: Scrape top 2 articles
    console.log('📄 Step 3: Scraping top ranking articles...');
    const topArticles = searchResults.slice(0, 2);
    
    const scrapedArticles = [];
    for (let i = 0; i < topArticles.length; i++) {
      console.log(`   Scraping article ${i + 1}: ${topArticles[i].url}`);
      try {
        const content = await scrapeArticleContent(topArticles[i].url);
        scrapedArticles.push({
          url: topArticles[i].url,
          title: topArticles[i].title,
          content: content
        });
        console.log(`   ✅ Successfully scraped article ${i + 1}`);
      } catch (error) {
        console.log(`   ⚠️  Failed to scrape article ${i + 1}: ${error.message}`);
      }
    }

    if (scrapedArticles.length === 0) {
      console.log('❌ Failed to scrape any reference articles');
      return;
    }

    console.log(`✅ Successfully scraped ${scrapedArticles.length} articles\n`);

    // Step 4: Enhance article using Claude
    console.log('🤖 Step 4: Enhancing article with Claude AI...');
    const enhancedContent = await enhanceArticle(
      originalArticle,
      scrapedArticles
    );
    console.log('✅ Article enhanced successfully\n');

    // Step 5: Save enhanced article
    console.log('💾 Step 5: Saving enhanced article...');
    const references = scrapedArticles.map(a => a.url);
    
    await saveEnhancedArticle({
      title: originalArticle.title + ' (Enhanced)',
      content: enhancedContent,
      original_article_id: originalArticle.id,
      is_updated: true,
      references: references,
      author: originalArticle.author,
      published_at: new Date().toISOString()
    });

    console.log('✅ Enhanced article saved successfully\n');
    console.log('🎉 Article enhancement completed!\n');

  } catch (error) {
    console.error('❌ Error during enhancement process:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main();
