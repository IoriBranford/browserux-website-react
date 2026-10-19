/**
 * # ⚡ vite.config.mjs
 *
 * Vite build and dev-server configuration for the BrowserUX Starter (React).
 *
 * All plugin-specific options are declared as named top-level constants before
 * the config export, keeping the `defineConfig` object free of magic values and
 * making each setting easy to locate, change, and review independently.
 *
 * Plugins configured:
 * - `@vitejs/plugin-react` — JSX transform and Fast Refresh
 * - `vite-plugin-preload-assets` — `<link rel="preload">` hints for fonts, JS, and CSS
 * - `vite-plugin-image-optimize` — lossy compression + WebP/AVIF generation at build time
 * - `vite-plugin-pwa` — Service Worker (injectManifest strategy) + Web App Manifest
 * - `vite-plugin-inject-sw-assets` — generates a static asset list for the custom SW to cache
 * - `vite-plugin-seo-files` — auto-generates `sitemap.xml` and `robots.txt` at build time
 *
 * Build output: `dist/` with two HTML entry points (`index.html`, `offline.html`).
 */

// ---------------------------------------------------------------------------- //
//
//  ### 📦 Imports
//  Vite, React, PWA, SEO, image, and preload plugins
//
// ---------------------------------------------------------------------------- //

/**
 * Vite's typed config factory — provides IntelliSense for all config options.
 */
import { defineConfig } from 'vite';

/**
 * Official Vite plugin for React — enables the JSX transform (no `import React`
 * needed) and React Fast Refresh for instant HMR during development.
 */
import react from '@vitejs/plugin-react';

/**
 * PWA plugin — generates a Web App Manifest and registers a Service Worker
 * using the `injectManifest` strategy (custom `sw.js`, not auto-generated).
 */
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Image optimisation plugin — applies lossy compression and converts images to
 * modern formats (WebP, AVIF) during the production build.
 */
import imageOptimize from 'vite-plugin-image-optimize';

/**
 * SEO files plugin — generates `sitemap.xml` and `robots.txt` into `dist/`
 * at build time, based on the route list and the configured site URL.
 */
import seoFiles from 'vite-plugin-seo-files';

/**
 * Preload plugin — injects `<link rel="preload">` hints into `index.html`
 * for critical JS bundles, CSS chunks, and optional Google Fonts.
 */
import preloadAssetsPlugin from 'vite-plugin-preload-assets';

/**
 * SW assets plugin — scans `dist/` for static assets matching the given
 * extensions and writes a `sw-assets.js` file the Service Worker can import
 * to pre-cache those files during installation.
 */
import injectSWAssets from 'vite-plugin-inject-sw-assets';

// ---------------------------------------------------------------------------- //
//
//  ### 🔧 Dev Config
//  Developer-editable configuration settings
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🌐 Site URL & Base Path
 *
 * `siteUrl` is the full public URL of your site, used for:
 * - SEO metadata (e.g. canonical URLs)
 * - Sitemap generation
 *
 * `base` defines the base path where your site is served.
 * It must match the subdirectory (if any) under which your site is deployed.
 *
 * Example:
 * If your site is deployed at https://browserux.com/starter/, use:
 * - const siteUrl = 'https://browserux.com';
 * - const base = '/starter/';
 *
 * If your site is not deployed in a subdirectory, simply use:
 * - const base = '/';
 */

const siteUrl = 'http://localhost';
const base = '/';

/**
 * ## 📱 WebManifest
 * Configuration for the `manifest.webmanifest` used in your PWA.
 *
 * The web manifest defines how your site behaves when "installed"
 * on a user's device and launched from the home screen.
 *
 * It is automatically injected by `vite-plugin-pwa` when using the `injectManifest` strategy.
 *
 * Key properties:
 * - `manifestName`: Full app name shown in install prompts (e.g. "BrowserUX")
 * - `manifestShortName`: Short version used under the app icon on mobile home screens
 * - `manifestDescription`: Optional description of your PWA
 * - `manifestLang`: Default language for the manifest (e.g. `en`, `fr`)
 * - `manifestStartUrl`: URL opened when launched from the home screen (can include `utm_source`)
 * - `manifestDisplay`: Defines app shell behavior (`standalone`, `fullscreen`, etc.)
 * - `manifestBackground_color`: Color used for the splash screen background
 * - `manifestTheme_color`: Primary theme color for browser UI
 * - `manifestOrientation`: Preferred screen orientation (`portrait`, `landscape`)
 * - `manifestIcons`: Array of icons with size and purpose declarations
 *
 * Tip:
 * Always provide both `any` and `maskable` icons to support modern Android launchers.
 */

const manifestName = '';
const manifestShortName = '';
const manifestDescription = '';
const manifestLang = '';
const manifestStartUrl = '/?utm_source=homescreen';
const manifestDisplay = 'standalone';
const manifestBackground_color = '#ffffff';
const manifestTheme_color = '#f05e0e';
const manifestOrientation = 'portrait';
const manifestIcons = [
  {
    src: 'icon/icon-192.png',
    type: 'image/png',
    sizes: '192x192',
    purpose: 'any'
  },
  {
    src: 'icon/icon-maskable-192.png',
    type: 'image/png',
    sizes: '192x192',
    purpose: 'maskable'
  },
  {
    src: 'icon/icon-512.png',
    type: 'image/png',
    sizes: '512x512',
    purpose: 'any'
  },
  {
    src: 'icon/icon-maskable-512.png',
    type: 'image/png',
    sizes: '512x512',
    purpose: 'maskable'
  }
];

/**
 * ## 📦 Inject SW Assets
 * Configuration for the `vite-plugin-inject-sw-assets` plugin.
 *
 * This plugin scans your `dist/` folder at build time and generates a list
 * of static assets (like images and JSON files) that should be precached
 * by your service worker. Each asset is fingerprinted with a short MD5 hash
 * so Workbox can detect file changes and invalidate the cache automatically.
 *
 * Key options:
 * - `injectSWAssetsDistDir`: Folder to scan after build (usually your Vite output folder)
 * - `injectSWAssetsOutput`: Name of the generated file to inject into the SW (used in `importScripts`)
 * - `injectSWAssetsExtensions`: File types to include (default: images, JSON, etc.)
 * - `injectSWAssetsExcludeFromManifest`: Automatically excludes icons listed in `manifest.webmanifest`
 * - `injectSWAssetsExcludePatterns`: Glob patterns for paths to exclude from the scan
 *   Example: ['vendor/**', 'fonts/**'] to skip entire sub-folders
 */

const injectSWAssetsDistDir = 'dist';
const injectSWAssetsOutput = 'sw-assets.js';
const injectSWAssetsExtensions = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'avif', 'ico', 'json'];
const injectSWAssetsExcludeFromManifest = true;
const injectSWAssetsExcludePatterns = [];

/**
 * ## 🚀 Preload Assets
 * Configuration for the `via vite-plugin-preload-assets` plugin.
 *
 * This is useful to improve performance and perceived loading speed, especially on first visit.
 * The plugin inserts `<link rel="preload">` and `<link rel="preconnect">` automatically.
 *
 * Key options:
 * - `preloadAssetsGoogleFonts`: If `true`, automatically adds `preconnect` and `preload` for Google Fonts
 * - `preloadAssetsFonts`: List of custom font URLs to preload manually (useful for self-hosted fonts)
 * - `preloadAssetsCriticalJs`: Array of JS entry point names to preload as `modulepreload` (e.g. ['main', 'landing'])
 * - `preloadAssetsCriticalCss`: Array of CSS entry names to preload as `style`
 *
 * Tips:
 * - Entry names come from your Rollup/Vite input (`main`, `landing`, etc.)
 * - Fonts can also be preloaded by using `data-preload` in HTML for image/font assets
 * - Works well with multi-page setups
 */

const preloadAssetsGoogleFonts = false;
const preloadAssetsFonts = [];
const preloadAssetsCriticalJs = ['main'];
const preloadAssetsCriticalCss = ['main'];

/**
 * ## 🗺 Sitemap
 * Configuration for automatically generating `sitemap.xml`.
 *
 * Used by search engines to discover and index all public pages of your site.
 * This is handled by `vite-plugin-seo-files`.
 *
 * Key options:
 * - `sitemapGenerate`: Enable/disable sitemap generation
 * - `sitemapExclude`: Array of paths or patterns to exclude (e.g. private or draft pages)
 * - `sitemapAdditionalUrls`: Manually add custom URLs not detected automatically
 *
 * Tip:
 * If you're using a multi-page setup or have localized versions (`/fr/`, `/en/`), make sure
 * they are either included in the HTML glob or added via `sitemapAdditionalUrls`.
 */

const sitemapGenerate = true;
const sitemapExclude = [];
const sitemapAdditionalUrls = [];

/**
 * ## 🤖 Robots
 * Configuration for generating the `robots.txt` file.
 *
 * This file controls how web crawlers (like Googlebot) are allowed to access your site.
 * Automatically handled by `vite-plugin-seo-files`.
 *
 * Key options:
 * - `robotsGenerate`: Enable/disable robots.txt generation
 * - `robotsDisallow`: Array of paths to disallow (e.g. ['/private', '/drafts'])
 *
 * Tip:
 * To allow full crawling, leave `robotsDisallow` empty.
 * To block all crawlers from the entire site, use: ['/']
 */

const robotsGenerate = true;
const robotsDisallow = [];

// ---------------------------------------------------------------------------- //
//
//  ### ⚙️ Vite Configuration
//  Plugin pipeline, path aliases, and build output settings
//
// ---------------------------------------------------------------------------- //

export default defineConfig({
  /** Public base path — all asset URLs are prefixed with this value */
  base: base,
  plugins: [
    /** React JSX transform + Fast Refresh (no additional options needed) */
    react(),
    /** Injects `<link rel="preload">` and `<link rel="preconnect">` tags for critical resources */
    preloadAssetsPlugin({
      /** Skips Google Fonts preconnect hint when false */
      preloadGoogleFonts: preloadAssetsGoogleFonts,
      /** Self-hosted font files to preload explicitly */
      fontsToPreload: preloadAssetsFonts,
      /** Rollup chunk names whose compiled JS bundles receive a preload tag */
      criticalJs: preloadAssetsCriticalJs,
      /** Rollup chunk names whose extracted CSS bundles receive a preload tag */
      criticalCss: preloadAssetsCriticalCss
    }),
    /** Compresses and converts images to WebP/AVIF at build time to reduce payload size */
    imageOptimize({
      /** JPEG compression quality (0–100); 80 balances file size and visual fidelity */
      jpegQuality: 80,
      /** PNG compression quality (0–100) */
      pngQuality: 80,
      /** WebP compression quality — slightly lower than JPEG for better compression ratio */
      webpQuality: 75,
      /** AVIF compression quality — lower value yields smaller files at acceptable quality */
      avifQuality: 70,
      /** Enables WebP conversion for all eligible images */
      webpEnable: true,
      /** Enables AVIF conversion for next-gen format support */
      avifEnable: true,
      /** Glob patterns for images to skip during optimization */
      exclude: [],
      /** Prints the optimized file list to the build console output */
      logListings: true
    }),
    /**
     * Registers the PWA service worker and generates the web app manifest.
     * Uses `injectManifest` so the SW is hand-authored and Workbox only injects
     * the precache manifest — giving full control over caching strategies.
     */
    VitePWA({
      /** Uses the `injectManifest` strategy so the custom sw.js controls caching logic */
      strategies: 'injectManifest',
      /** Directory containing the source service worker file */
      srcDir: 'src',
      /** Source service worker filename compiled and injected with the precache manifest */
      filename: 'sw.js',
      /** Automatically updates the service worker in the background on new deployments */
      registerType: 'autoUpdate',
      manifest: {
        /** Full application name displayed on splash screens and install prompts */
        name: manifestName,
        /** Abbreviated name shown on the homescreen where space is limited */
        short_name: manifestShortName,
        /** Short app description surfaced in OS install dialogs */
        description: manifestDescription,
        /** BCP 47 language tag for the manifest content */
        lang: manifestLang,
        /** Launch URL; UTM parameter identifies traffic from homescreen installs */
        start_url: manifestStartUrl,
        /** Restricts the PWA to URLs under the base path */
        scope: base,
        /** Hides browser UI chrome to render as a standalone native-like app */
        display: manifestDisplay,
        /** Background color shown on the splash screen before the app shell loads */
        background_color: manifestBackground_color,
        /** Toolbar and status-bar tint color on supported mobile browsers */
        theme_color: manifestTheme_color,
        /** Locks device orientation to portrait mode */
        orientation: manifestOrientation,
        /** Icon set for homescreen, splash screen, and adaptive icon contexts */
        icons: manifestIcons
      }
    }),
    /**
     * Scans `dist/` after the build and writes a fingerprinted asset list (`sw-assets.js`)
     * for the service worker to import via `importScripts`, enabling static asset precaching.
     */
    injectSWAssets({
      /** Build output directory scanned for static assets */
      distDir: injectSWAssetsDistDir,
      /** Filename of the generated asset list module written to dist */
      output: injectSWAssetsOutput,
      /** File extensions included in the asset list */
      extensions: injectSWAssetsExtensions,
      /** Prevents listed assets from also entering the Workbox precache manifest */
      excludeFromManifest: injectSWAssetsExcludeFromManifest,
      /** Additional glob patterns omitted from the asset list */
      excludePatterns: injectSWAssetsExcludePatterns
    }),
    /** Generates `sitemap.xml` and `robots.txt` into `dist/` during the build */
    seoFiles({
      /** Canonical site origin prepended to all sitemap URLs */
      siteUrl: siteUrl,
      /** Toggles sitemap.xml generation */
      generateSitemap: sitemapGenerate,
      /** Route paths excluded from the sitemap */
      exclude: sitemapExclude,
      /** Manually specified URLs appended to the sitemap */
      additionalUrls: sitemapAdditionalUrls,
      /** Toggles robots.txt generation */
      generateRobots: robotsGenerate,
      /** Path prefixes added as Disallow rules in robots.txt */
      disallow: robotsDisallow
    })
  ],
  build: {
    rollupOptions: {
      /**
       * Multi-page input: `main` is the SPA shell, `offline` is a standalone
       * fallback page the Service Worker serves when the network is unavailable.
       */
      input: {
        main: 'index.html',
        offline: 'offline.html'
      }
    },
    /** Output directory — must match `injectSWAssetsDistDir` above */
    outDir: 'dist',
    /** Wipe dist/ before each build to prevent stale assets from persisting */
    emptyOutDir: true
  }
});
