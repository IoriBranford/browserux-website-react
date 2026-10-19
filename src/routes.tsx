/**
 * # 🗺️ Application Route Configuration
 *
 * Defines the complete client-side route tree for the application using
 * React Router v7's data router object format.
 *
 * The root route mounts `RootLayout` as the persistent shell (header, footer,
 * `<Outlet>`) and registers `NotFound` as the `errorElement` so any routing
 * or loader error bubbles up to a consistent 404/error UI.
 *
 * Each child route declares an async `loader` that pre-fetches its page data
 * before the component renders, enabling React Router's built-in data loading
 * without a separate data-fetching library.
 *
 * Consumed by `createBrowserRouter` (or equivalent) at the application entry point.
 */

import type { RouteObject } from 'react-router-dom';

// ---------------------------------------------------------------------------- //
//
//  ### 📄 Page Components
//  Lazy-imported route-level components rendered inside RootLayout's <Outlet>
//
// ---------------------------------------------------------------------------- //

/**
 * Default landing page rendered at the index route (`/`).
 * Receives pre-fetched data from `/data/home.json` via the route loader.
 */
import Home from './pages/Home/Home.tsx';

/**
 * About page rendered at `/about`.
 * Receives pre-fetched data from `/data/about.json` via the route loader.
 */
import About from './pages/About/About.tsx';

/**
 * Catch-all error boundary page displayed for unmatched routes or loader errors.
 * Wired as `errorElement` on the root route so it handles the entire subtree.
 */
import NotFound from './pages/NotFound/NotFound.tsx';

// ---------------------------------------------------------------------------- //
//
//  ### 🏗️ Layout
//  Root shell component wrapping all child routes
//
// ---------------------------------------------------------------------------- //

/**
 * Persistent application shell rendered for every route under `/`.
 * Contains the shared navigation, header, footer, and an `<Outlet>` where
 * child route components are injected.
 */
import RootLayout from './layouts/RootLayout.tsx';

// ---------------------------------------------------------------------------- //
//
//  ### 🗺️ Route Tree
//  Exported route config array consumed by createBrowserRouter at app entry
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🗺️ Route Configuration
 *
 * A React Router v7 route object array defining the full application route tree.
 */
const routes: RouteObject[] = [
  {
    /** Root path — acts as the layout wrapper for all nested routes */
    path: '/',
    /** Persistent shell with shared navigation and an <Outlet> for child routes */
    element: <RootLayout />,
    /** Displayed for any unmatched path or error thrown in a loader/component */
    errorElement: <NotFound />,
    children: [
      {
        /** Index route: renders <Home /> at exactly '/' with no additional path segment */
        index: true,
        element: <Home />,
        /** Pre-fetches home page data before the component renders */
        loader: async () => fetch('/data/home.json')
      },
      {
        /** Renders <About /> at '/about' */
        path: 'about',
        element: <About />,
        /** Pre-fetches about page data before the component renders */
        loader: async () => fetch('/data/about.json')
      }
    ]
  }
];

export default routes;
