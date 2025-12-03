# 🚀 Quick Setup Guide for Spotify Authentication

To get the "Connect with Spotify" functionality working, you need to set up API credentials.

## Step 1: Get Spotify API Credentials

1. **Go to Spotify Developer Dashboard**
   - Visit: https://developer.spotify.com/dashboard
   - Log in with your Spotify account (or create one)

2. **Create a New App**
   - Click "Create App" button
   - Fill in the details:
     - **App name**: `Festive Playlist Architect` (or any name you like)
     - **App description**: `AI-powered Christmas playlist generator`
     - **Website**: `http://localhost:3000` (for local development)
     - **Redirect URI**: `http://localhost:3000/api/auth/callback/spotify`
     - Check "I understand and agree to Spotify's Developer Terms of Service"
   - Click "Save"

3. **Get Your Credentials**
   - After creating the app, you'll see your app dashboard
   - Copy your **Client ID** (visible on the dashboard)
   - Click "Show Client Secret" and copy your **Client Secret**

## Step 2: Get Groq API Key (Free)

1. **Go to Groq Console**
   - Visit: https://console.groq.com
   - Sign up for a free account (no credit card required)

2. **Create API Key**
   - Once logged in, go to "API Keys" section
   - Click "Create API Key"
   - Copy your API key (you'll only see it once!)

## Step 3: Generate NextAuth Secret

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Copy the generated string - this will be your `NEXTAUTH_SECRET`.

## Step 4: Create .env.local File

Create a file named `.env.local` in the root of your project (`festive-playlist-architect/`) with the following content:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

**Replace the placeholder values with your actual credentials!**

## Step 5: Restart the Dev Server

After creating `.env.local`, restart your development server:

1. Stop the current server (Ctrl+C in the terminal)
2. Run `npm run dev` again

The app will automatically detect the environment variables and exit demo mode!

## ✅ Verification

Once set up:
- The demo mode banner should disappear
- "Connect with Spotify" button will work
- You'll be able to authenticate and generate real playlists

## 🔒 Security Notes

- **Never commit `.env.local` to git** (it's already in `.gitignore`)
- Keep your credentials secure
- Don't share your Client Secret publicly

## 🆘 Troubleshooting

**"Invalid redirect URI" error:**
- Make sure the redirect URI in Spotify Dashboard exactly matches: `http://localhost:3000/api/auth/callback/spotify`
- Check for typos or extra spaces

**"Unauthorized" error:**
- Verify your Client ID and Client Secret are correct
- Make sure there are no extra spaces in `.env.local`
- Restart the dev server after changing environment variables

**Still in demo mode:**
- Check that `.env.local` is in the root directory (same level as `package.json`)
- Verify all environment variables are set (no empty values)
- Restart the dev server

