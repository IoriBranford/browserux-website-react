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

import { Outlet, NavLink } from 'react-router-dom';
import styles from './RootLayout.module.css';
import NavigateLoader from '../components/NavigateLoader/NavigateLoader';
import { useEffect } from 'react';

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
   * ## 🔗 getLinkClass
   *
   * Returns the CSS module class for active `NavLink` elements.
   * Returns `undefined` (not a falsy string) for inactive links so React
   * omits the `className` attribute entirely rather than setting it to `""`.
   *
   * @param isActive - Whether the link's path matches the current URL
   * @returns Active CSS class or undefined
   */
  const getLinkClass = ({ isActive }: { isActive: boolean }): string | undefined =>
    isActive ? styles.active : undefined;

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

      <nav className={styles.nav}>

        <div>

          {/** Active class applied automatically by NavLink when path matches '/' */}
          <NavLink to="/" className={getLinkClass}>
            Home
          </NavLink>

          {/** Visual separator between nav links */}
          <span className={styles.separator}> | </span>

          {/** Active class applied automatically by NavLink when path matches '/about' */}
          <NavLink to="/about" className={getLinkClass}>
            About
          </NavLink>
        </div>

        {/** Custom web component — registered via the useEffect lazy import above */}
        <browserux-theme-switcher></browserux-theme-switcher>

      </nav>

      {/** Renders the matched child route component (Home, About, etc.) */}
      <Outlet />

    </div>
  );

}
