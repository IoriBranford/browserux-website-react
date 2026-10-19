/**
 * # 🏗️ RootLayout
 *
 * Persistent application shell rendered for every route in the app.
 *
 * Renders a top navigation bar with `NavLink` entries that receive an
 * `active` CSS module class when their path matches the current URL.
 * A `<NavigateLoader>` displays a progress indicator during route transitions.
 * Child route content is injected via React Router's `<Outlet>`.
 *
 * On mount, the four `browserux-*` custom web components are lazy-imported
 * as side effects so their custom element definitions are registered in the
 * browser without blocking the initial render.
 */

import { Outlet } from 'react-router-dom';
import NavigateLoader from '../components/NavigateLoader/NavigateLoader';
import { useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar';

// ---------------------------------------------------------------------------- //
//
//  ### 🏗️ Component
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🏗️ RootLayout
 *
 * Application shell component mounted as the root route element.
 */
export default function RootLayout() {
  /**
   * ## 🔌 Web Component Bootstrap
   *
   * Lazy-imports all `browserux-*` packages after the initial render so their
   * custom element definitions are registered with the browser's Custom Elements
   * registry before any child route tries to use them.
   */
  useEffect(() => {
    /** Registers `<browserux-theme-switcher>` — light/dark theme toggle */
    import('browserux-theme-switcher');
    /** Registers `<browserux-share-button>` — native share sheet trigger */
    import('browserux-share-button');
    /** Registers `<browserux-pwa-ui>` — PWA install prompt and offline indicator */
    import('browserux-pwa-ui');
  }, []);

  return (
    <div>
      {/** Displays a top-of-page progress bar during route transitions */}
      <NavigateLoader />

      <NavBar />

      {/** Renders the matched child route component (Home, About, etc.) */}
      <Outlet />

    </div>
  );

}
