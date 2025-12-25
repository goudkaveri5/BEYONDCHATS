// services/claudeAI.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

/**
 * Enhance article using Claude AI
 */
export async function enhanceArticle(originalArticle, referenceArticles) {
  try {
    const prompt = buildEnhancementPrompt(originalArticle, referenceArticles);
    
    console.log('   Sending request to Claude API...');
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const enhancedContent = message.content[0].text;
    
    console.log(`   Received enhanced content (${enhancedContent.length} characters)`);
    
    return enhancedContent;

  } catch (error) {
    throw new Error(`Claude API error: ${error.message}`);
  }
}

/**
 * Build the enhancement prompt for Claude
 */
function buildEnhancementPrompt(originalArticle, referenceArticles) {
  const references = referenceArticles.map((article, index) => {
    return `
Reference Article ${index + 1}:
Title: ${article.title}
URL: ${article.url}
Content Preview: ${article.content.substring(0, 2000)}...
`;
  }).join('\n---\n');

  return `You are an expert content writer and SEO specialist. Your task is to rewrite and enhance an article to match the style, formatting, and quality of top-ranking Google search results.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

TOP-RANKING REFERENCE ARTICLES:
${references}

INSTRUCTIONS:
1. Analyze the structure, formatting, and writing style of the reference articles
2. Rewrite the original article to match the quality and style of these top-ranking articles
3. Improve SEO optimization while maintaining accuracy
4. Use similar heading structures, paragraph lengths, and formatting
5. Keep the core message and facts from the original article
6. Make the content more engaging and easier to read
7. Ensure proper HTML formatting with headings (h2, h3), paragraphs, lists, etc.
8. Add a "References" section at the end citing the source articles

IMPORTANT:
- Output ONLY the enhanced article content in HTML format
- Do NOT include any preamble or explanation
- Start directly with the article content
- Include proper HTML tags: <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em>
- End with a References section listing the URLs

Begin the enhanced article now:`;
}

/**
 * Validate enhanced content
 */
function validateEnhancedContent(content) {
  if (!content || content.length < 500) {
    throw new Error('Enhanced content is too short');
  }
  
  if (!content.includes('<') || !content.includes('>')) {
    console.warn('Warning: Content may not be properly formatted as HTML');
  }
  
  return true;
}
