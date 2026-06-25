# MedLingo 🩺
**Powered by The Best Academy**

تعلّم المصطلحات الطبية بالإنجليزية — A Duolingo-style Arabic medical terminology app.

---

## Run locally

Make sure you have **Node.js 18+** installed, then:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Build for production

```bash
npm run build
```

The output goes into the `dist/` folder — ready to deploy anywhere.

---

## Deploy options

### Netlify (easiest — drag and drop)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
3. Drag the `dist/` folder into the upload area
4. Done — you get a live URL instantly

### Vercel
```bash
npm install -g vercel
vercel
```
Follow the prompts — it auto-detects Vite.

### GitHub Pages
1. Push the project to a GitHub repo
2. In `vite.config.js` add `base: '/your-repo-name/'`
3. Run `npm run build`
4. Push the `dist/` folder to the `gh-pages` branch

---

## Install as mobile app (PWA)
1. Open the deployed URL in **Safari** (iOS) or **Chrome** (Android)
2. Tap **Share → Add to Home Screen** (iOS) or **Install App** (Android)
3. MedLingo appears as a full-screen app icon on your home screen

---

## Project structure

```
medlingo/
├── index.html          # HTML entry point
├── vite.config.js      # Vite config
├── package.json        # Dependencies
├── public/
│   ├── favicon.svg     # App icon
│   └── manifest.json   # PWA manifest
└── src/
    ├── main.jsx        # React entry point
    ├── index.css       # Global styles
    └── App.jsx         # Full application
```
