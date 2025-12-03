# 🚀 Deploy to Vercel - Step by Step

## Step 1: Initialize Git (if not already done)

```bash
cd festive-playlist-architect
git init
git add .
git commit -m "Initial commit - Festive Playlist Architect"
```

## Step 2: Push to GitHub

1. **Create a new repository on GitHub**
   - Go to: https://github.com/new
   - Name it: `festive-playlist-architect` (or any name)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push your code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/festive-playlist-architect.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

## Step 3: Deploy to Vercel

### Option A: Via Vercel Website (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Click "Deploy"

4. **Wait for Deployment**
   - Vercel will build and deploy
   - You'll get a URL like: `https://festive-playlist-architect.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd festive-playlist-architect
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? festive-playlist-architect
# - Directory? ./
```

## Step 4: Set Environment Variables in Vercel

1. **Go to your project dashboard**
   - Click on your project in Vercel
   - Go to "Settings" → "Environment Variables"

2. **Add these variables:**
   ```
   SPOTIFY_CLIENT_ID = your_spotify_client_id
   SPOTIFY_CLIENT_SECRET = your_spotify_client_secret
   GROQ_API_KEY = your_groq_api_key
   NEXTAUTH_SECRET = fxl+U7/HDbrPzLb8F3oHWhU3sGqyzSAxlOQITjngoKQ=
   NEXTAUTH_URL = https://your-app-name.vercel.app
   ```

3. **Important:** Replace `your-app-name.vercel.app` with your actual Vercel URL!

4. **Redeploy** after adding variables (Vercel will auto-redeploy)

## Step 5: Update Spotify Redirect URI

1. **Go to Spotify Dashboard**
   - https://developer.spotify.com/dashboard
   - Click your app → "Edit Settings"

2. **Add Production Redirect URI**
   - In "Redirect URIs" section
   - Add: `https://your-app-name.vercel.app/api/auth/callback/spotify`
   - Click "Add"
   - **Save**

3. **You can keep localhost too** (for local dev):
   - `http://localhost:3000/api/auth/callback/spotify`
   - `https://your-app-name.vercel.app/api/auth/callback/spotify`

## Step 6: Test

1. Visit your Vercel URL
2. Click "Connect with Spotify"
3. Should work! 🎉

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Got Vercel URL
- [ ] Added environment variables in Vercel
- [ ] Updated Spotify redirect URI with HTTPS URL
- [ ] Tested authentication

## Troubleshooting

**"Invalid redirect URI" after deployment:**
- Make sure the redirect URI in Spotify matches exactly: `https://your-app.vercel.app/api/auth/callback/spotify`
- Check `NEXTAUTH_URL` in Vercel matches your domain

**Environment variables not working:**
- Make sure you saved them in Vercel
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

