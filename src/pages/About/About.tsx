/**
 * # 📄 About Page
 *
 * Page component for the `/about` route of the BrowserUX Starter (Vite + React) app.
 *
 * Content (title, paragraphs, feature list) is injected at route load time via
 * React Router's `useLoaderData` hook — no internal state or side effects needed.
 * HTML strings from the loader are rendered with `dangerouslySetInnerHTML` to
 * support rich inline markup (links, `<code>`, etc.) in paragraph and feature items.
 */

import { useLoaderData } from 'react-router-dom';
import styles from './About.module.css';

// ---------------------------------------------------------------------------- //
//
//  ### 📦 Types
//
// ---------------------------------------------------------------------------- //

/**
 * Shape of the about page content loaded from `/data/about.json`.
 */
interface AboutData {
    title?: string;
    featuresTitle?: string;
    paragraphs?: string[];
    features?: string[];
}

// ---------------------------------------------------------------------------- //
//
//  ### 🖼️ Component
//
// ---------------------------------------------------------------------------- //

/**
 * ## 📄 About
 *
 * Default export for the `/about` route page component.
 */
export default function About() {

  /** Retrieve all loader-supplied content for this route */
  const data = useLoaderData() as AboutData;

  return (
    <main className={`page ${styles.about}`}>

      <img
        className="has-dark"
        src="/img/logo-browserux-starter-600.png"
        alt="logo Browser UX Starter Vite + ReactJS"
        width="600"
        height="400"
        loading="lazy"
      />

      <h1>{data?.title || 'About'}</h1>

      {data.paragraphs?.map((paragraph, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}

      <h2>{data.featuresTitle || "What's included"}</h2>

      <ul>
        {data.features?.map((feature, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: feature }} />
        ))}
      </ul>

      <browserux-share-button
        style={{ "--bux-share-btn-bg": "#fff" } as React.CSSProperties}
        title="About BrowserUX Starter Vite + React"
      ></browserux-share-button>

    </main>
  );
}
