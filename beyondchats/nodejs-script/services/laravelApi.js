// services/laravelApi.js
import axios from 'axios';

const API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Fetch the latest article that needs enhancement
 */
export async function fetchLatestArticle() {
  try {
    const response = await api.get('/articles/latest');
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('No articles available for enhancement');
      return null;
    }
    throw new Error(`Failed to fetch latest article: ${error.message}`);
  }
}

/**
 * Save the enhanced article
 */
export async function saveEnhancedArticle(articleData) {
  try {
    const response = await api.post('/articles', articleData);
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
    throw new Error(`Failed to save enhanced article: ${error.message}`);
  }
}

/**
 * Get all articles
 */
export async function getAllArticles() {
  try {
    const response = await api.get('/articles');
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }
}
