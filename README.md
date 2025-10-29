Image Search MERN + OAuth
=================================

A full-stack image search app with OAuth authentication, Unsplash integration, multi-select results, top searches, and per-user search history.

This repository contains both:
- A Next.js app (in `app/` with API routes under `app/api/*`) that implements the full feature set
- A Vite React client (in `client/`) that can be used with the Express server in `server/`
- An Express + Passport.js server (in `server/`) that provides OAuth and REST APIs

Features
--------
- OAuth login with Google, Facebook, GitHub (Passport.js)
- Only authenticated users can search or view history
- Search results fetched from Unsplash Search API
- Multi-select grid with live “Selected: X images” counter
- Top 5 searches across all users (banner)
- Per-user search history with timestamps (local time)

Folder Structure
----------------
```
Image-Search-MERN-OAuth/
  app/                 # Next.js application (App Router) + API routes
    api/               # Next API endpoints (auth/session, search, history, top searches)
    dashboard/         # Dashboard UI
    login/             # OAuth login UI
    globals.css        # Global styles (CSS variables / theme)
  client/              # Vite React client (optional UI)
    src/
  server/              # Express + Passport.js back end (OAuth + REST)
    routes/            # Express routes for auth/search
    models/            # Mongoose models
    config/passport.js # Passport strategies
```

MONGO_URI=mongodb://localhost:27017/image_search_oauth
SESSION_SECRET=your-strong-session-secret
BASE_URL=http://localhost:5000

# Unsplash
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

For the Next.js app, define env in `.env.local` at the repo root:
```
# Unsplash for Next API
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Session/auth (implementation specific)
NEXTAUTH_SECRET=your_next_auth_like_secret_or_app_secret
MONGODB_URI=mongodb://localhost:27017/image_search_oauth
BASE_URL=http://localhost:3000
```

Install & Run
-------------
Using the Next.js app (recommended)
```
pnpm install
pnpm dev
```
- App: http://localhost:3000
- API routes: http://localhost:3000/api/*

Using the Express server + Vite client
```
cd server && npm install && npm run dev
# Server: http://localhost:5000

cd ../client && npm install && npm run dev
# Client: http://localhost:5173
```

Update the client to call your server’s origin if not using the Next API. The current client has been aligned to call `/api/*` so it can be reverse-proxied by the Next app or served via the same origin.

API Endpoints
-------------
All endpoints require authentication unless stated otherwise.

POST /api/search
- Body: `{ "term": "cats" }`
- Behavior: Saves `{ userId, term, timestamp }` to MongoDB, calls Unsplash search, returns results.

Example:
```
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"term":"cats"}'
```

GET /api/top-searches
- Returns top 5 most frequent terms across all users.
```
curl http://localhost:3000/api/top-searches
```

GET /api/history
- Returns the logged-in user’s search history with timestamps.
```
curl http://localhost:3000/api/history
```

Auth (server-side OAuth, typical patterns)
- GET `/api/auth/google` → OAuth login
- GET `/api/auth/facebook` → OAuth login
- GET `/api/auth/github` → OAuth login
- POST `/api/auth/logout` → Logout

Frontend Behavior
-----------------
- Only authenticated users can access search/history. Unauthenticated users are prompted to log in.
- Top Searches: banner at the top pulls from `/api/top-searches`.
- Search: posts `{ term }` to `/api/search`, shows “Results for X — N results” and renders a 4-column grid (xl) with checkboxes.
- Multi-Select Counter: shows “Selected: X images” above the grid; selection is tracked client-side.
- History: shows local timestamps (`toLocaleString`) either below results or in the history view.

Screenshots / Visual Proof
--------------------------
Place screenshots or GIFs under `public/` or in a `/docs` folder and reference them here.
- OAuth login (Google/Facebook/GitHub)
- Top Searches banner
- Search results + multi-select
- Search history section

License
-------
MIT


