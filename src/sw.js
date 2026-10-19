/**
 * # ⚙️ Service Worker
 *
 * Custom Workbox service worker for the PWA.
 *
 * Handles asset precaching and runtime caching strategies for all
 * request types: navigation, scripts, styles, images, and API calls.
 *
 * Caching strategies by request type:
 * - Navigation (HTML)  → NetworkFirst, fallback to cached index, then offline page
 * - Scripts / Styles   → CacheFirst (`static-resources` cache)
 * - Images             → CacheFirst (`images` cache)
 * - API requests       → NetworkFirst with 5s timeout (`api-cache`)
 *
 * This file is processed by the Vite PWA plugin, which injects the
 * precache manifest into `self.__WB_MANIFEST` at build time.
 */

// ---------------------------------------------------------------------------- //
//
//  ### 📦 External Asset Manifest
//  Loads the separately generated sw-assets.js file containing additional
//  asset URLs to include in the precache (e.g. icons, fonts, static files)
//
// ---------------------------------------------------------------------------- //

/**
 * Synchronously loads `sw-assets.js` into the service worker scope.
 * `importScripts` is a service worker global (not an ES module import) —
 * it executes synchronously and populates `self.__INJECTED_ASSETS__`
 * with any extra assets defined outside the Vite build manifest.
 */
importScripts('sw-assets.js');

// ---------------------------------------------------------------------------- //
//
//  ### 🗂️ Precache
//  Merges Vite build manifest with injected external assets and precaches all entries
//
// ---------------------------------------------------------------------------- //

/**
 * Precaches a list of URLs and registers a fetch handler that serves them
 * from cache. All entries in the manifest get a revision hash for cache busting.
 */
import { precacheAndRoute } from 'workbox-precaching';

/**
 * Merges two asset lists into a single precache manifest and activates Workbox routing:
 *
 * - `self.__WB_MANIFEST`: injected by vite-plugin-pwa at build time — contains
 *   all Vite output files with their revision hashes.
 * - `self.__INJECTED_ASSETS__`: populated by the externally loaded `sw-assets.js`;
 *   falls back to an empty array if the file did not define it.
 */
precacheAndRoute([
  ...self.__WB_MANIFEST,
  ...self.__INJECTED_ASSETS__ || []
]);

// ---------------------------------------------------------------------------- //
//
//  ### 📥 Workbox Route Imports
//  Routing and caching strategy modules used by the runtime route handlers below
//
// ---------------------------------------------------------------------------- //

/**
 * `registerRoute` maps URL patterns or request conditions to caching strategies.
 * `setCatchHandler` provides a global fallback for any route that throws during fetch.
 */
import { registerRoute, setCatchHandler } from 'workbox-routing';

/**
 * `CacheFirst` serves from cache and only hits the network on a cache miss —
 * ideal for versioned static assets. `NetworkFirst` always attempts the network
 * first and falls back to cache, suitable for navigations and API calls.
 */
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// ---------------------------------------------------------------------------- //
//
//  ### 🧭 Navigation Route
//  NetworkFirst strategy for page navigations with a two-level offline fallback
//
// ---------------------------------------------------------------------------- //

/**
 * Handles all navigation requests (full-page loads and client-side route changes).
 *
 * Priority chain:
 * - 1. Try the network via `NetworkFirst` — returns a fresh response when online.
 * - 2. If the network fails, serve `/index.html` from the precache (SPA shell).
 * - 3. If the precache also misses, serve `/offline.html` as a last resort.
 *
 * `ignoreSearch: true` strips query strings when matching cache entries,
 * ensuring the shell is found regardless of URL parameters.
 */
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      /** Attempt a live network fetch; return immediately if successful */
      const preload = await new NetworkFirst().handle({ event });
      if (preload) return preload;
    } catch (_) {
      /** Network fetch failed — fall through to cache-based fallbacks */
    }

    /** Look up the precached SPA shell as first offline fallback */
    const cachedIndex = await caches.match('/index.html', { ignoreSearch: true });
    if (cachedIndex) return cachedIndex;

    /** Return the dedicated offline page if the SPA shell is also unavailable */
    return await caches.match('/offline.html', { ignoreSearch: true });
  }
);

// ---------------------------------------------------------------------------- //
//
//  ### 🚨 Global Catch Handler
//  Last-resort fallback for any fetch that throws an unhandled error
//
// ---------------------------------------------------------------------------- //

/**
 * Catches errors thrown by any registered route handler and returns a safe response.
 *
 * For document requests, it attempts to serve the cached `/offline.html` page.
 * If that cache entry is also missing, it returns a plain-text 503 response so
 * the browser receives a meaningful error instead of a generic fetch failure.
 *
 * All other request destinations (scripts, images, API…) receive `Response.error()`,
 * which lets the browser handle the failure normally without a custom response.
 */
setCatchHandler(async ({ event }) => {

  /** Only apply the custom offline response for document (page) requests */
  if (event.request.destination === 'document') {

    /** Attempt to serve the offline page from cache */
    const cachedOffline = await caches.match('/offline.html', {
      ignoreSearch: true
    });
    if (cachedOffline) return cachedOffline;

    /**
     * No offline page in cache — return a minimal 503 so the browser
     * shows a readable error rather than an opaque network failure
     */
    return new Response('Offline fallback not found', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }


  /** For non-document requests, propagate the error as a standard network error */
  return Response.error();
});

// ---------------------------------------------------------------------------- //
//
//  ### 🗂️ Static Asset Routes
//  CacheFirst strategies for versioned scripts, styles, and images
//
// ---------------------------------------------------------------------------- //

/**
 * ## 📜 Scripts & Styles Route
 *
 * CacheFirst is appropriate here because Vite appends content hashes to
 * script and style filenames — a changed file gets a new URL, so serving
 * a cached response for an existing URL is always correct.
 */
registerRoute(
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'static-resources',
  })
);

/**
 * ## 🖼️ Images Route
 *
 * CacheFirst maximizes performance for images, which are large and rarely
 * change. Cached independently from scripts/styles for easier cache management.
 */
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
  })
);

// ---------------------------------------------------------------------------- //
//
//  ### 🔌 API Route
//  NetworkFirst with timeout for dynamic data requests
//
// ---------------------------------------------------------------------------- //

/**
 * ## 📡 API Cache Route
 *
 * NetworkFirst ensures API responses are always fresh when the network is available.
 * The 5-second timeout prevents slow connections from blocking the UI indefinitely —
 * after the timeout, Workbox falls back to the last cached response automatically.
 *
 * Update the origin pattern to match the actual API domain before deploying.
 */
registerRoute(
  ({ url }) => url.origin === 'https://your-api.com',
  new NetworkFirst({
    cacheName: 'api-cache',
    /** Fall back to cached API response if the network doesn't respond within 5 seconds */
    networkTimeoutSeconds: 5
  })
);