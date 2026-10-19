/**
 * # 🧪 Home.test.jsx
 *
 * Test suite for the `<Home>` page component, which renders the application's
 * root route (`/`) using content injected by a React Router loader.
 *
 * The component reads `useLoaderData()` to receive its content (title, intro
 * chapo, paragraphs). Because loader data arrives via router context — not props —
 * `useLoaderData` is mocked so the component can be driven with arbitrary data
 * in isolation, without a real data-loading router.
 *
 * Testing strategy:
 * - Partial mock of `react-router-dom`: real module preserved, only `useLoaderData` replaced.
 * - `MemoryRouter` + `Routes` + `Route` wraps every render to satisfy the full
 *   router context required by React Router components.
 * - Assertions use accessible roles and text queries to stay close to how real
 *   users perceive the page.
 */

/**
 * Vitest test primitives plus `vi` for mocking.
 */
import { describe, it, expect, vi } from 'vitest';

/**
 * React Testing Library utilities.
 * - `render`: mounts the component into a JSDOM document
 * - `screen`: queries the rendered output by accessible roles and visible text
 */
import { render, screen } from '@testing-library/react';

/**
 * Router primitives needed to create a minimal route tree.
 * `Routes` + `Route` are used (not just `MemoryRouter`) because the real
 * `<Home>` component expects to be mounted under an active matched route.
 */
import { MemoryRouter, Route, Routes } from 'react-router-dom';

/**
 * The component under test — the Home page, driven entirely by loader data.
 */
import Home from '../../src/pages/Home/Home.jsx';

/**
 * ## 🎭 Partial Mock — react-router-dom
 *
 * Replaces only `useLoaderData` with a controllable spy while keeping the rest
 * of the real module intact (`MemoryRouter`, `Routes`, `Route`, etc.).
 *
 * `vi.importActual` + spread prevents other exports from becoming `undefined`.
 * Vitest hoists `vi.mock` above all imports, so the mock is active before
 * any binding in this file resolves.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn()
  };
});

/**
 * Typed reference to the mocked `useLoaderData` hook.
 * Imported after `vi.mock` so this binding resolves to the spy.
 * Each test drives it via `.mockReturnValue(loaderData)`.
 */
import { useLoaderData } from 'react-router-dom';

// ---------------------------------------------------------------------------- //
//
//  ### 🛠️ Test Helper
//  Shared render factory — injects loader data and mounts Home in a route tree
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🏗️ renderHome
 *
 * Convenience factory that sets the mocked loader data and renders `<Home>`
 * inside a minimal `MemoryRouter` → `Routes` → `Route` tree.
 *
 * The full route tree (not just `MemoryRouter`) is required because React Router
 * uses the matched route context internally, even when the hook is mocked.
 * Defaults to an empty object so tests that don't need specific data stay concise.
 *
 * @param {Object} [loaderData={}] - Loader data to inject into `useLoaderData`.
 * @returns {import('@testing-library/react').RenderResult} The RTL render result.
 */
const renderHome = (loaderData = {}) => {
  /** Seed the mock so the component receives exactly the data this test needs */
  useLoaderData.mockReturnValue(loaderData);
  return render(
    <MemoryRouter>
      <Routes>
        {/** Mount Home at "/" to match the default MemoryRouter initial entry */}
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
};

// ---------------------------------------------------------------------------- //
//
//  ### 🏠 Home Page Test Suite
//  Covers logo presence, title rendering, fallback behaviour, and content blocks
//
// ---------------------------------------------------------------------------- //

describe('Home', () => {

  /**
   * ## ✅ Logo image — presence
   *
   * Confirms the hero image is rendered and accessible.
   * Queries by `img` role and a partial accessible name match to stay resilient
   * to minor `alt` text wording changes.
   */
  it('renders the logo image', () => {
    renderHome({ title: 'Welcome' });
    /** Case-insensitive partial match on alt text — tolerates minor copy changes */
    const img = screen.getByRole('img', { name: /logo browser ux starter.*react/i });
    expect(img).toBeInTheDocument();
  });

  /**
   * ## ✅ Title — rendered from loader data
   *
   * Verifies that the component displays the `title` value provided by the loader.
   * Queries by heading role with an exact name to catch casing or whitespace regressions.
   */
  it('renders the title from loader data', () => {
    renderHome({ title: 'BrowserUX Starter' });
    /** Exact heading text match — no regex, so accidental surrounding text would fail */
    expect(screen.getByRole('heading', { name: 'BrowserUX Starter' })).toBeInTheDocument();
  });

  /**
   * ## ✅ Title — fallback when absent
   *
   * When the loader provides no `title`, the component should fall back to the
   * string `"Home"`. An empty object simulates a loader that omits the field.
   */
  it('falls back to "Home" when title is absent', () => {
    /** Empty object: `loaderData.title` is `undefined`, triggering the default */
    renderHome({});
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });

  /**
   * ## ✅ Intro chapo — rendered in bold
   *
   * Ensures `introChapo` content is wrapped in a `<strong>` element.
   * Querying by text content and then inspecting `tagName` tests both the text
   * and the semantic markup simultaneously.
   */
  it('renders introChapo in bold', () => {
    renderHome({ introChapo: 'A great starter kit' });
    /** Locate the element by its visible text content */
    const strong = screen.getByText('A great starter kit');
    /** `tagName` from the DOM is always uppercase; 'STRONG' confirms bold wrapping */
    expect(strong.tagName).toBe('STRONG');
  });

  /**
   * ## ✅ Intro paragraphs — all items rendered
   *
   * Confirms that every string in the `intro` array appears in the document.
   * Uses case-insensitive regex matches to tolerate minor capitalisation differences.
   */
  it('renders intro paragraphs', () => {
    renderHome({ intro: ['First paragraph', 'Second paragraph'] });
    /** Both paragraphs must be present — either missing would indicate a render bug */
    expect(screen.getByText(/first paragraph/i)).toBeInTheDocument();
    expect(screen.getByText(/second paragraph/i)).toBeInTheDocument();
  });

  /**
   * ## ✅ Landmark — main element present
   *
   * Verifies the page wraps its content in a `<main>` landmark element.
   * This is an accessibility requirement: assistive technologies rely on
   * the `main` role to let users skip to primary content.
   */
  it('renders the main landmark', () => {
    renderHome({ title: 'Home' });
    /** `getByRole('main')` maps to `<main>` — fails if the element is absent */
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

});
