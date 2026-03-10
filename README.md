# ◈ Lambent Labs

Portfolio website for Marc Lehane & Jon Lamb — built with Vite + React, served via Express.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Select this repository
4. Railway auto-detects the config — no changes needed
5. Under **Settings → Networking**, generate a domain

That's it. Railway will run `npm install && npm run build` then `node server.js`.

## Admin Access

Click the **◈ LambentLabs** logo **5 times rapidly** to open the admin login.

Default password: `lambent2024`

Change the `ADMIN_PASSWORD` constant in `src/App.jsx` before deploying.

> **Note:** Admin edits are saved to `localStorage` — they persist per browser.
> For shared/persistent admin edits across devices, a backend API + database would be needed.
