# ⚡ Quick Start - Get Spotify Working in 5 Minutes

## What You Need

1. **Spotify Account** (free is fine)
2. **Groq Account** (free, no credit card)
3. **5 minutes**

## Step-by-Step

### 1. Get Spotify Credentials (2 minutes)

1. Go to: https://developer.spotify.com/dashboard
2. Click **"Create App"**
3. Fill in:
   - Name: `Festive Playlist Architect`
   - Description: `AI Christmas playlist generator`
   - **IMPORTANT**: Add this Redirect URI:
     ```
     http://localhost:3000/api/auth/callback/spotify
     ```
4. Click **"Save"**
5. Copy your **Client ID** and **Client Secret**

### 2. Get Groq API Key (1 minute)

1. Go to: https://console.groq.com
2. Sign up (free, no credit card)
3. Go to **"API Keys"**
4. Click **"Create API Key"**
5. Copy the key (you'll only see it once!)

### 3. Update .env.local (1 minute)

Open `.env.local` in the project root and fill in:

```env
SPOTIFY_CLIENT_ID=paste_your_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
GROQ_API_KEY=paste_your_groq_key_here
NEXTAUTH_SECRET=fxl+U7/HDbrPzLb8F3oHWhU3sGqyzSAxlOQITjngoKQ=
NEXTAUTH_URL=http://localhost:3000
```

### 4. Restart Server (1 minute)

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Done!

Now when you click "Connect with Spotify", it will:
- Redirect to Spotify login
- Ask for permissions
- Return to your app
- Start analyzing your music!

## 🎯 Quick Checklist

- [ ] Spotify app created with redirect URI
- [ ] Client ID and Secret copied
- [ ] Groq API key created
- [ ] `.env.local` file filled in
- [ ] Dev server restarted

## 🐛 Common Issues

**"Invalid redirect URI"**
→ Check the redirect URI in Spotify Dashboard matches exactly:
   `http://localhost:3000/api/auth/callback/spotify`

**Still shows demo mode**
→ Make sure `.env.local` is in the root directory
→ Restart the dev server after adding credentials

**"Unauthorized" error**
→ Double-check your Client ID and Secret (no extra spaces)

