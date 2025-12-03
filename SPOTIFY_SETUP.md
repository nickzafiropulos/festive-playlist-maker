# 🎵 Spotify Setup - Redirect URI Explained

## What is a Redirect URI?

When a user clicks "Connect with Spotify", here's what happens:

1. User clicks button → App redirects to Spotify login
2. User logs in and grants permissions → Spotify needs to send them back
3. **Redirect URI** = Where Spotify sends the user back to your app

## Where to Set It in Spotify Dashboard

### Step 1: Go to Your App Settings

1. Visit: https://developer.spotify.com/dashboard
2. Click on your app (or create one if you haven't)
3. Click **"Edit Settings"** button

### Step 2: Add Redirect URI

In the "Redirect URIs" section, you'll see a text field or "Add" button.

**Add this EXACT URI:**
```
http://localhost:3000/api/auth/callback/spotify
```

⚠️ **Important Details:**
- Must be **exactly** this (no trailing slashes, no spaces)
- `http://` not `https://` (for localhost)
- `localhost:3000` (not `127.0.0.1`)
- `/api/auth/callback/spotify` (this is the NextAuth callback route)

### Step 3: Save

Click **"Add"** or **"Save"** to save the redirect URI.

## Visual Guide

In Spotify Dashboard, you'll see something like:

```
┌─────────────────────────────────────────┐
│ Redirect URIs                           │
├─────────────────────────────────────────┤
│ [http://localhost:3000/api/auth/...] [X]│
│                                         │
│ [+ Add]                                 │
└─────────────────────────────────────────┘
```

## Why This Matters

If the redirect URI doesn't match:
- ❌ Spotify will reject the authentication
- ❌ You'll see "Invalid redirect URI" error
- ❌ Users can't connect their Spotify account

If it matches correctly:
- ✅ Authentication works smoothly
- ✅ Users are redirected back to your app
- ✅ You get their access token

## For Production

When you deploy to production (e.g., Vercel), you'll need to add another redirect URI:

```
https://your-domain.vercel.app/api/auth/callback/spotify
```

You can have multiple redirect URIs - one for localhost and one for production.

## Quick Checklist

- [ ] Opened Spotify Developer Dashboard
- [ ] Clicked "Edit Settings" on your app
- [ ] Added redirect URI: `http://localhost:3000/api/auth/callback/spotify`
- [ ] Saved the settings
- [ ] Verified no typos or extra spaces

