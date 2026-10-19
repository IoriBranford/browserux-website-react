/**
 * # 🏠 Home
 *
 * Landing page rendered at the index route (`/`).
 *
 * Page content (title, subtitle, intro text) is pre-fetched before render
 * via the route loader defined in `routes.tsx` and consumed here with
 * `useLoaderData`. Optional chaining on all data fields guards against a
 * missing or partial JSON response without throwing.
 */

import { useLoaderData } from 'react-router-dom';
import styles from './Home.module.css';

// ---------------------------------------------------------------------------- //
//
//  ### 📦 Types
//
// ---------------------------------------------------------------------------- //

/**
 * Shape of the home page content loaded from `/data/home.json`.
 */
interface HomeData {
    title?: string;
    subtitle?: string;
    introChapo?: string;
    intro?: string[];
}

// ---------------------------------------------------------------------------- //
//
//  ### 🏠 Component
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🏠 Home
 *
 * Renders the landing page with content sourced from the route loader payload.
 */
export default function Home() {

  /** Pre-fetched page content from `/data/home.json` — available before first render */
  const data = useLoaderData() as HomeData;

  return (
    <>
      <main className={`page ${styles.home}`}>

        <img
          className="has-dark"
          src="/img/logo-browserux-starter-600.png"
          alt="logo Browser UX Starter Vite + ReactJS"
          width="600"
          height="400"
          loading="lazy"
        />

        <h1>
          {data?.title || 'Home'}<br />
          {data?.subtitle}
        </h1>

        <div>
          <p><strong>{data?.introChapo}</strong></p>
          {data.intro?.map((paragraph, i) => (
            <p key={i}>{paragraph} </p>
          ))}
        </div>

        <browserux-share-button
          style={{ "--bux-share-btn-bg": "#fff" } as React.CSSProperties}
        ></browserux-share-button>

      </main>

      <browserux-pwa-ui
        snackbar
        position="bottom-left"
      ></browserux-pwa-ui>
    </>
  );
}
