**EN** | [FR](../../fr/docs/templates/vite-react.md)

<div align="center">
  <img src="https://raw.githubusercontent.com/Effeilo/browserux-starter/main/assets/logo-browserux-starter-react.png" alt="BrowserUX Starter vite-react logo" width="200"/>
  <h1>BrowserUX Starter <code>vite-react</code></h1>
  <p><strong>A standards-first React 19 SPA on top of the BrowserUX foundation.</strong></p>
</div>

---

`vite-react` is the BrowserUX Starter template for React 19 single-page applications built with Vite, React Router v7, Workbox, native CSS, Web Components, and controlled service workers.

React is used here as the UI layer. The foundation remains browser-native: PWA support, semantic HTML, native CSS, browser APIs, BrowserUX Web Components, and explicit service worker control.

- [Project website](https://browserux.com/starter/)
- [Template documentation](../../docs/templates/vite-react.md)
- [Root README](../../README.md)

## ✨ What this template includes

- ⚛️ React 19 SPA with React Router v7 and `createBrowserRouter`.
- 🗂️ Route data loaders backed by static JSON files in `public/data/`.
- 📴 Installable PWA powered by `vite-plugin-pwa` in `injectManifest` mode.
- ⚙️ Custom Workbox service worker in [`src/sw.js`](./src/sw.js).
- 🧩 BrowserUX Web Components for native UX behavior.
- 🎨 `browserux.css` base styles with native user interface patterns.
- 🖼️ Image optimization, preload hints, sitemap, robots, and SW asset injection.
- 🧪 Vitest and Testing Library test suite.
- 🔤 Optional TypeScript variant through `npm create browserux@latest`.

## 🧱 Standards-first base

- 📱 **PWA**: Web App Manifest, Service Worker, Cache API, offline fallback.
- 🧩 **Web Components**: Custom Elements, HTML attributes, native lifecycle.
- 🎨 **Native CSS**: CSS variables, media queries, native user interface patterns.
- 🌐 **Browser APIs**: Web Share API, `beforeinstallprompt`, View Transitions API, `localStorage`.
- 📝 **Semantic HTML**: native elements and browser behavior before proprietary abstractions.

## 🚀 Quick start

From the BrowserUX CLI:

```bash
npm create browserux@latest
```

Choose `vite-react`, then run:

```bash
cd your-project
npm install
npm run dev
```

To validate the real PWA behavior locally:

```bash
npm run build
npm run preview
```

Run tests with:

```bash
npm test
```

## 🗂️ Project structure

```text
public/
  data/
  icon/
  img/
src/
  components/
  layouts/
  pages/
  styles/
  main.jsx
  routes.jsx
  routes-list.js
  sw.js
tests/
index.html
offline.html
vite.config.mjs
vitest.config.mjs
```

## 📝 Notes

- `npm run dev` does not exercise the full offline/service worker flow.
- Update `siteUrl`, `base`, and manifest values in [`vite.config.mjs`](./vite.config.mjs) before production deployment.
- Static JSON page data lives in `public/data/`.
- React is optional in the BrowserUX ecosystem; choose `raw` or `vite-vanilla` if you want to build without React or Vue.

## 📄 License

[MIT](../../LICENSE.md) © 2026 [Effeilo](https://github.com/Effeilo)
