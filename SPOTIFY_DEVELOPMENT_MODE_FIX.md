# Fixing Spotify 403 Error - Development Mode Issue

## The Problem

If you're getting a 403 error even after granting all permissions, your Spotify app is likely in **Development Mode**. 

Development Mode apps can only be used by:
- The app creator
- Users explicitly added as "Users and Access" in the app settings

## Quick Fix: Add Yourself as a User

### Step 1: Go to Spotify Dashboard
1. Visit: https://developer.spotify.com/dashboard
2. Sign in with your Spotify account
3. Click on your app (e.g., "Festive Playlist Architect")

### Step 2: Add User Access
1. Click **"Edit Settings"** (or the gear icon)
2. Scroll down to **"Users and Access"** section
3. Click **"Add User"** button
4. Enter your **Spotify email address** (the one you use to log into Spotify)
5. Click **"Add"**
6. Click **"Save"** at the bottom

### Step 3: Try Again
1. Go back to your app
2. Click "Disconnect & Reconnect with Spotify"
3. Grant all permissions
4. Should work now! ✅

## Alternative: Submit for Review (Production Mode)

If you want anyone to use your app:

1. Go to Spotify Dashboard → Your App
2. Click **"Submit for Review"**
3. Fill out the form:
   - App description
   - Use case
   - Privacy policy URL (if required)
4. Submit and wait for approval (can take a few days)

Once approved, your app will work for all Spotify users!

## Verify Your Settings

While you're in the Dashboard, also check:

### Redirect URIs
Make sure you have:
```
https://your-app.vercel.app/api/auth/callback/spotify
```
- Must be HTTPS
- No trailing slash
- Matches your Vercel URL exactly

### Required Scopes
Your app should request:
- `user-top-read`
- `user-read-recently-played`
- `playlist-modify-public`
- `playlist-modify-private`
- `user-read-email`
- `user-read-private`

These are automatically requested by NextAuth, but verify they're in your app settings.

## Still Not Working?

1. **Check the error message** - it should now tell you if it's a development mode issue
2. **Check browser console** - look for detailed error logs
3. **Verify your email** - make sure you added the exact email you use for Spotify
4. **Wait a minute** - sometimes it takes a moment for changes to propagate

