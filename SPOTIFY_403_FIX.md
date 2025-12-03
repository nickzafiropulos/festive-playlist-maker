# Fixing Spotify 403 Forbidden Error

## What Causes 403 Errors?

A 403 Forbidden error from Spotify usually means:
1. **Missing Permissions**: You didn't grant all required scopes when connecting
2. **App Not Approved**: The app needs to be re-authorized
3. **Redirect URI Mismatch**: The redirect URI in Spotify Dashboard doesn't match exactly

## Quick Fix Steps

### Step 1: Disconnect and Reconnect
1. Go to: https://www.spotify.com/account/apps/
2. Find "Festive Playlist Architect" (or your app name)
3. Click "Remove Access"
4. Go back to your app and click "Connect with Spotify" again
5. **IMPORTANT**: Make sure you click "Agree" to ALL permissions when Spotify asks

### Step 2: Verify Redirect URI
1. Go to: https://developer.spotify.com/dashboard
2. Click your app → "Edit Settings"
3. Check "Redirect URIs" section
4. Make sure it has EXACTLY:
   ```
   https://your-app.vercel.app/api/auth/callback/spotify
   ```
   - No trailing slash
   - Must be HTTPS (not HTTP)
   - Must match your Vercel URL exactly

### Step 3: Check Required Scopes
The app needs these scopes:
- `user-top-read` - To get your top tracks
- `user-read-recently-played` - To get recently played tracks
- `playlist-modify-public` - To create public playlists
- `playlist-modify-private` - To create private playlists
- `user-read-email` - To get your email
- `user-read-private` - To get your profile

All of these should be requested automatically when you connect.

## Still Not Working?

If you still get 403 after reconnecting:
1. Check the browser console for more error details
2. Make sure your Spotify account is active
3. Try in an incognito/private window
4. Clear browser cookies for your Vercel domain

