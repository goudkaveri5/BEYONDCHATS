# BEYONDCHATS
BeyondChats Article Enhancement System
Architecture Overview
┌─────────────────┐
│  React Frontend │
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Laravel API   │
│   (Port 8000)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│     MySQL DB    │     │  Node.js     │
│                 │◄────┤  Enhancement │
└─────────────────┘     │  Script      │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
            ┌───────────────┐     ┌─────────────┐
            │ Google Search │     │  Claude API │
            └───────────────┘     └─────────────┘
Tech Stack
Backend: Laravel 10.x (PHP 8.1+)
Scraping Engine: Node.js 18+
Frontend: React 18 + Vite + Tailwind CSS
Database: MySQL 8.0
LLM: Claude API (Anthropic)
Web Scraping: Puppeteer, Cheerio
Project Structure
beyondchats-assignment/
├── laravel-api/          # Phase 1: Laravel CRUD API
├── nodejs-script/        # Phase 2: Article enhancement script
├── react-frontend/       # Phase 3: React UI
└── README.md            # This file
Prerequisites
PHP 8.1 or higher
Composer
Node.js 18+ and npm
MySQL 8.0
Claude API key (get from console.anthropic.com)
Local Setup
1. Clone Repository
git clone 
cd beyondchats-assignment
2. Laravel API Setup (Phase 1)
cd laravel-api

# Install dependencies
composer install

# Setup environment
cp .env.example .env

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=beyondchats
# DB_USERNAME=root
# DB_PASSWORD=

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Scrape initial articles
php artisan scrape:beyondchats

# Start server
php artisan serve
API will be available at http://localhost:8000

API Endpoints:

GET /api/articles - List all articles
GET /api/articles/{id} - Get single article
POST /api/articles - Create article
PUT /api/articles/{id} - Update article
DELETE /api/articles/{id} - Delete article
3. Node.js Enhancement Script (Phase 2)
cd ../nodejs-script

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Add your Claude API key to .env
# CLAUDE_API_KEY=your_key_here
# LARAVEL_API_URL=http://localhost:8000/api

# Run the enhancement script
npm start
This will:

Fetch the latest article from Laravel API
Search Google for the article title
Scrape top 2 ranking articles
Use Claude to rewrite the article
Save updated version via Laravel API
4. React Frontend Setup (Phase 3)
cd ../react-frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Configure API URL in .env
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
Frontend will be available at http://localhost:5173

Features Implemented
Phase 1: Laravel API ✅
Web scraper for BeyondChats blog (last 5 articles)
MySQL database with articles table
Full CRUD API with proper validation
Artisan command for scraping
Phase 2: Node.js Enhancement ✅
Google search automation with Puppeteer
Article content extraction with Cheerio
Claude API integration for content rewriting
Style matching based on top-ranking articles
Automatic citation generation
Laravel API integration for publishing
Phase 3: React Frontend ✅
Responsive article listing
Side-by-side comparison (Original vs Enhanced)
Professional UI with Tailwind CSS
Citation display
Loading states and error handling
Live Demo
Frontend: [Deploy to Vercel]
API: [Deploy to Railway]
Environment Variables
Laravel (.env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beyondchats
DB_USERNAME=root
DB_PASSWORD=
Node.js (.env)
CLAUDE_API_KEY=your_claude_api_key
LARAVEL_API_URL=http://localhost:8000/api
React (.env)
VITE_API_URL=http://localhost:8000/api
Implementation Notes
Phase 1 Approach
Used Guzzle HTTP client for web scraping
DOMDocument for HTML parsing
Eloquent ORM for database operations
API Resource classes for consistent JSON responses
Phase 2 Approach
Puppeteer for Google search (handles JavaScript rendering)
Cheerio for parsing article content
Claude Sonnet 4.5 for content enhancement
Intelligent prompt engineering to match top-ranking styles
Phase 3 Approach
Vite for fast development
Axios for API calls
Tailwind CSS for responsive design
React hooks for state management
Known Limitations
Google Search: May require CAPTCHA solving in production (use ScraperAPI or similar)
Rate Limiting: No rate limiting implemented on APIs
Authentication: Basic implementation, no user roles
Error Recovery: Limited retry logic
Caching: No caching layer for API responses
Testing
# Laravel tests
cd laravel-api
php artisan test

# Node.js tests
cd nodejs-script
npm test

# React tests
cd react-frontend
npm test
Deployment
Deploy Laravel to Railway
Create new project on Railway
Add MySQL database
Connect GitHub repository
Set environment variables
Deploy
Deploy React to Vercel
cd react-frontend
npm run build
vercel --prod
Deploy Node.js Script
Can be run as a cron job or scheduled task on Railway/Heroku.

Time Spent
Phase 1: 2.5 hours
Phase 2: 3 hours
Phase 3: 1.5 hours
Documentation: 1 hour
Total: ~8 hours
Future Enhancements
 Add user authentication
 Implement caching layer (Redis)
 Add rate limiting
 Webhook support for automated enhancement
 Scheduled article enhancement via cron
 A/B testing for enhanced articles
 Analytics dashboard
Contact
For questions or issues, contact: support@beyondchats.com

License
MIT License
