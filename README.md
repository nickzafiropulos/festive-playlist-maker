# 🎄 Festive Playlist Maker

Create your perfect personalized Christmas playlist powered by AI. We analyze your music taste and blend it with festive holiday spirit to craft a unique musical journey.

Made with ❤️ for the NearForm Hackathon 2024

## ✨ Features

- **AI-Powered Playlist Generation**: Uses Groq's Llama 3 to create personalized festive playlists
- **Spotify Integration**: Seamlessly connects with your Spotify account
- **Music Profile Analysis**: Analyzes your top tracks, genres, and audio features
- **Festive Theming**: Beautiful Christmas-themed UI with animations
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Spotify Developer Account
- Groq API Key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd festive-playlist-architect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables (see below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 Getting API Credentials

### Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in app details:
   - App name: "Festive Playlist Architect"
   - Description: "AI-powered Christmas playlist generator"
   - Redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Copy your **Client ID** and **Client Secret**
5. Add the redirect URI in your app settings

### Groq API Key

1. Go to [Groq Console](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### NextAuth Secret

Generate a random secret for NextAuth:
```bash
openssl rand -base64 32
```

## 📝 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **AI**: Groq (Llama 3)
- **Music API**: Spotify Web API
- **Animations**: Framer Motion
- **Confetti**: canvas-confetti

## 📁 Project Structure

```
festive-playlist-architect/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── profile/route.ts
│   │   ├── generate/route.ts
│   │   └── create-playlist/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Hero.tsx
│   ├── MusicProfileCard.tsx
│   ├── PlaylistGenerator.tsx
│   ├── PlaylistResults.tsx
│   ├── SnowEffect.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/
│   ├── spotify.ts       # Spotify API client
│   ├── spotify-analyzer.ts
│   ├── groq.ts          # Groq AI client
│   └── utils.ts
└── types/
    ├── spotify.ts
    ├── groq.ts
    └── next-auth.d.ts
```

## 🎨 Features in Detail

### Music Profile Analysis
- Fetches top tracks from short-term, medium-term, and long-term periods
- Analyzes audio features (energy, danceability, valence, etc.)
- Identifies top genres and artists
- Creates comprehensive music profile

### AI Playlist Generation
- Uses Groq's Llama 3 model to generate personalized recommendations
- Blends user's music taste with festive themes
- Creates 15-20 song recommendations with reasoning
- Generates warm, personal narrative about user's musical year

### Playlist Creation
- Creates playlist on Spotify
- Adds all recommended tracks
- Provides direct link to playlist

## 🎮 Easter Eggs

- **Konami Code**: Enter the Konami code (↑↑↓↓←→←→BA) for extra snow!
- **Santa Hat**: Hover over the music icon in the hero section to see a Santa hat appear

## 🎭 Demo Mode

The app includes a demo mode that allows you to explore the application without Spotify authentication. Demo mode activates automatically when:

- Environment variables are not configured
- `DEMO_MODE=true` is set in environment variables

In demo mode:
- Example music profile is displayed
- AI-generated playlist narrative is shown (using demo data)
- Playlist creation is simulated (no actual Spotify playlist is created)

This is perfect for:
- Presentations and demos
- Testing the UI without API credentials
- Development when APIs are unavailable

## 📱 Responsive Design

The app is fully responsive and optimized for:
- Mobile devices (reduced snow effects for performance)
- Tablets
- Desktop screens

## 🚢 Deployment

### Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications and offers seamless deployment.

#### Step 1: Prepare Your Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Make sure all your code is committed and pushed

#### Step 2: Create Vercel Project

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your repository
4. Vercel will auto-detect Next.js settings

#### Step 3: Configure Environment Variables

In the Vercel project settings, add all required environment variables:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GROQ_API_KEY=your_groq_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

**Important**: 
- Generate a new `NEXTAUTH_SECRET` for production (use `openssl rand -base64 32`)
- Set `NEXTAUTH_URL` to your production domain (Vercel will provide this)

#### Step 4: Configure Spotify Redirect URIs

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click "Edit Settings"
4. Add your production redirect URI:
   - `https://your-domain.vercel.app/api/auth/callback/spotify`
5. Save changes

#### Step 5: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

#### Step 6: Update Spotify Redirect URI (if needed)

After deployment, if your domain changes, update the redirect URI in Spotify Dashboard.

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

#### Netlify

1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in site settings
5. Update Spotify redirect URI to: `https://your-site.netlify.app/api/auth/callback/spotify`

#### Railway

1. Create new project from GitHub
2. Add environment variables
3. Deploy automatically
4. Update Spotify redirect URI

#### AWS Amplify

1. Connect repository
2. Build settings: Auto-detect
3. Add environment variables
4. Update Spotify redirect URI

### Post-Deployment Checklist

- [ ] All environment variables are set
- [ ] Spotify redirect URI is configured for production
- [ ] `NEXTAUTH_URL` matches your production domain
- [ ] Test authentication flow
- [ ] Test playlist generation
- [ ] Monitor error logs
- [ ] Check analytics (if configured)

### Environment Variable Validation

The app validates all required environment variables at runtime. If any are missing, you'll see helpful error messages. Check the console logs for specific missing variables.

You can check the health of your deployment by visiting `/api/health`. This endpoint validates all environment variables and returns the status.

### Performance Optimizations

- **Mobile Optimization**: Snow effects are automatically reduced on mobile devices for better performance
- **Lazy Loading**: Heavy components are loaded on demand
- **Image Optimization**: Next.js automatically optimizes images
- **Code Splitting**: Automatic code splitting for optimal bundle sizes
- **Caching**: API responses are cached where appropriate

### Monitoring

- Check `/api/health` endpoint for system status
- Monitor error logs in your deployment platform
- Analytics events are logged to console in development mode
- Set up proper analytics service in production for tracking

## 🤝 Contributing

This project was created for the NearForm Hackathon 2024. Contributions and improvements are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Spotify Web API** for music data
- **Groq** for AI-powered playlist generation
- **NearForm** for the hackathon opportunity
- **shadcn/ui** for beautiful UI components

## 📸 Screenshots

_Add screenshots of your app here_

## 🛡️ Production Features

### Error Handling
- App-level error boundaries (`error.tsx` and `global-error.tsx`)
- Graceful error recovery with retry options
- User-friendly error messages

### Rate Limiting
- Groq API: 10 requests per minute per user
- Spotify API: 50 requests per minute per user
- Automatic retry with exponential backoff
- Rate limit headers in responses

### Environment Validation
- Runtime validation of all required environment variables
- Helpful error messages for missing configuration
- Health check endpoint at `/api/health`

### Analytics
- Tracks key user actions (authentication, playlist generation, etc.)
- Error tracking for debugging
- Session-based analytics

### Performance
- Mobile-optimized snow effects (reduced on small screens)
- Lazy loading for heavy components
- Optimized animations
- Smooth scroll behavior

## 🐛 Known Issues

- None at the moment!

## 🔮 Future Enhancements

- [ ] Playlist editing capabilities
- [ ] Multiple playlist themes (not just Christmas)
- [ ] Social sharing features
- [ ] Playlist history
- [ ] Collaborative playlists

---

Made with ❤️ for the NearForm Hackathon 2024

