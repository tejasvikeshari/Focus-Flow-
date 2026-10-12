# FocusFlow — Groq AI + YouTube Study Finder

A responsive student productivity dashboard built with React + Vite, plus a Node/Express backend for Groq AI chat and YouTube Data API search.

## Features
- Login-style welcome screen, dashboard, task manager, custom focus timer with completion chime, expense tracker, daily missions, profile/theme settings.
- AI answers default to English.
- Sign-in is a local demo session only; it does not provide secure accounts or sync data across devices.
- Groq-powered AI Study Studio, with API key kept server-side.
- Study video finder displays YouTube video titles, thumbnails, and channel names in the app using YouTube Data API v3.
- Local browser storage for demo tasks, expenses, missions and profile settings; this is not a cloud database.

## Requirements
- Node.js 20+ recommended (Node 18+ with built-in fetch may also work).
- npm and internet connection.

## Setup (beginner-friendly)
1. Extract this ZIP and open the extracted `FocusFlow-Groq-YouTube` folder in VS Code.
2. In VS Code choose **Terminal → New Terminal**.
3. Install packages:
   ```bash
   npm install
   ```
4. In the project root, make a copy of `.env.example` and name the copy `.env` (same folder as `package.json` and `server.js`).
5. Open `.env` and set:
   ```dotenv
   GROQ_API_KEY=your_real_groq_key_here
   GROQ_MODEL=openai/gpt-oss-120b
   YOUTUBE_API_KEY=your_real_youtube_key_here
   API_PORT=3001
   ```
   Replace the placeholders locally. Do not send keys in chat or put them in `src/`.
6. Start frontend and backend together:
   ```bash
   npm run dev
   ```
7. Open the local Vite URL shown in the terminal (usually `http://localhost:5173`). Keep the terminal running.

## Create keys
- Groq: https://console.groq.com/keys
- Google Cloud: https://console.cloud.google.com/ — create/select a project, enable **YouTube Data API v3**, then go to **APIs & Services → Credentials → Create Credentials → API key**.
- YouTube API docs: https://developers.google.com/youtube/v3

## Troubleshooting
- After changing `.env`, stop and restart `npm run dev` (Ctrl+C, then run again).
- If the AI says key missing, check `.env` is in the root beside `server.js`, and variable name is exactly `GROQ_API_KEY`.
- If video search reports a key/API error, ensure `YOUTUBE_API_KEY` is correct and YouTube Data API v3 is enabled for the same Google Cloud project. Check quota in Google Cloud Console.
- If `npm install` fails, check internet and Node/npm installation.

## Security
- `.env` is ignored by Git. Never share it, commit it, screenshot it, or paste keys into the browser or React source.
- API keys may have quotas/terms. Restrict the YouTube key to YouTube Data API v3 in Google Cloud when possible. Groq keys should only be used on the backend.
- Do not put secrets in any `VITE_` variable. Frontend code must never read the keys.

## Project structure
```text
FocusFlow-Groq-YouTube/
├── .env.example
├── .gitignore
├── package.json
├── server.js          # Groq AI + YouTube API backend routes
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```
