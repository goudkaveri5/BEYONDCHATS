git# Deployment Guide

## Quick Deploy Stack

### Option 1: All-in-One (Recommended for Demo)

**Railway.app (Backend + Database)**
1. Create account at railway.app
2. Create new project
3. Add MySQL database
4. Deploy Laravel API from GitHub
5. Set environment variables
6. Note the API URL

**Vercel (Frontend)**
1. Create account at vercel.com
2. Import React project from GitHub
3. Set environment variable: `VITE_API_URL=<your-railway-api-url>`
4. Deploy

### Option 2: Individual Services

#### Deploy Laravel API to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd laravel-api
railway init

# Add MySQL
railway add --database mysql

# Set environment variables
railway variables set APP_KEY=$(php artisan key:generate --show)

# Deploy
railway up
```

#### Deploy React to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd react-frontend
vercel --prod
```

#### Deploy Node.js Script

The Node.js script can be deployed as:
1. **Scheduled Job on Railway**: Set up as a cron job
2. **GitHub Actions**: Run on schedule
3. **Manual Trigger**: Deploy and run manually when needed

**GitHub Actions Example:**

```yaml
# .github/workflows/enhance.yml
name: Enhance Articles

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  enhance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd nodejs-script
          npm install
      - name: Run enhancement
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
          LARAVEL_API_URL: ${{ secrets.LARAVEL_API_URL }}
        run: |
          cd nodejs-script
          npm start
```

## Environment Variables Checklist

### Laravel (.env)
- ✅ APP_KEY
- ✅ DB_CONNECTION, DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- ✅ APP_URL

### Node.js (.env)
- ✅ CLAUDE_API_KEY
- ✅ LARAVEL_API_URL

### React (.env)
- ✅ VITE_API_URL

## Post-Deployment Steps

1. **Run Migrations**
```bash
railway run php artisan migrate --force
```

2. **Scrape Initial Articles**
```bash
railway run php artisan scrape:beyondchats
```

3. **Test API**
```bash
curl https://your-api-url.railway.app/api/health
```

4. **Run Enhancement Script**
```bash
cd nodejs-script
npm start
```

## Troubleshooting

### CORS Issues
Add to Laravel `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['https://your-frontend.vercel.app'],
```

### Database Connection
Ensure Railway MySQL credentials are correctly set in `.env`

### API Key Issues
Verify Claude API key is valid and has sufficient credits

### Puppeteer on Railway
Add to `package.json`:
```json
"scripts": {
  "postinstall": "node node_modules/puppeteer/install.js"
}
```

## Cost Estimates (Free Tiers)

- **Railway**: 500 hours/month free
- **Vercel**: Unlimited deployments
- **Claude API**: Pay per token (~$0.003 per 1K tokens)

Total monthly cost: **$0-5** (mostly Claude API usage)