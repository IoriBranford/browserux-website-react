/**
 * # 🗺️ Static Route List
 *
 * Manual enumeration of all public-facing routes in the application.
 *
 * Because this project uses React Router in SPA mode, routes exist only at
 * runtime and cannot be discovered by crawling static HTML files. This list
 * provides `vite-plugin-seo-files` with the explicit set of paths it needs
 * to pre-render sitemap entries and any other static SEO artifacts at build time.
 *
 * Keep this list in sync with the route definitions in `routes.tsx` whenever
 * a public route is added, renamed, or removed.
 */

// ---------------------------------------------------------------------------- //
//
//  ### 🔗 Public Routes
//  All navigable paths exposed to users and search engines
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🔗 Application Route List
 *
 * An ordered array of all public URL paths in the application.
 *
 * Consumed by:
 * - `vite-plugin-seo-files`: generates sitemap entries for each path at build time
 *
 * Tip:
 * - Do not include dynamic segments (e.g. `/post/:id`) — only static, crawlable paths
 * - Do not include auth-gated or admin-only routes that should be excluded from sitemaps
 */
const routes: string[] = [
  '/',      /** Home page */
  '/about'  /** About page */
];

export default routes;
