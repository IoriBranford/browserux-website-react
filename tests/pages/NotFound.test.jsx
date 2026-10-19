/**
 * # 🧪 NotFound.test.jsx
 *
 * Test suite for the `<NotFound>` page component, rendered when the router
 * matches no known route (404 error boundary).
 *
 * The component has no loader data and no hook dependencies, so no mocking is
 * required — only a `MemoryRouter` wrapper to satisfy React Router's context
 * for any internal `<Link>` or navigation calls.
 *
 * Testing strategy:
 * - Structural: heading, description text, emoji, and `role="alert"` container
 * - Accessibility: the error container exposes `role="alert"` so screen readers
 *   announce the error automatically on mount
 * - Interaction: the "Go back home" button is clicked via `userEvent` to confirm
 *   it does not throw inside a `MemoryRouter` (no real navigation target needed)
 */

/**
 * Vitest test primitives — no `vi` needed since this suite requires no mocking.
 */
import { describe, it, expect } from 'vitest';

/**
 * React Testing Library utilities.
 * - `render`: mounts the component into a JSDOM document
 * - `screen`: queries the rendered output by accessible roles and visible text
 */
import { render, screen } from '@testing-library/react';

/**
 * Simulates real user interactions (full event sequence: pointerdown → mousedown
 * → click → pointerup…) as opposed to `fireEvent`, which fires a single synthetic
 * event. Used here to test the button click in a realistic way.
 */
import userEvent from '@testing-library/user-event';

/**
 * In-memory router that satisfies React Router's context requirement without
 * a real browser URL. Sufficient here since the component has no loader hook.
 */
import { MemoryRouter } from 'react-router-dom';

/**
 * The component under test — the 404 Not Found page with an error message,
 * a decorative emoji, and a "Go back home" navigation button.
 */
import NotFound from '../../src/pages/NotFound/NotFound.jsx';

// ---------------------------------------------------------------------------- //
//
//  ### 🛠️ Test Helper
//  Minimal render factory — no data injection required for this component
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🏗️ renderNotFound
 *
 * Mounts `<NotFound>` inside a `MemoryRouter` and returns the RTL render result.
 * No loader data or mock setup is needed — the component is fully self-contained.
 *
 * @returns {import('@testing-library/react').RenderResult} The RTL render result.
 */
const renderNotFound = () =>
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------- //
//
//  ### 🚫 NotFound Page Test Suite
//  Covers error messaging, accessibility role, decorative content, and interaction
//
// ---------------------------------------------------------------------------- //

describe('NotFound', () => {

  /**
   * ## ✅ Heading — 404 error title
   *
   * Confirms the primary heading is present and contains the expected error code.
   * A case-insensitive partial match keeps the test resilient to punctuation changes.
   */
  it('renders the 404 heading', () => {
    renderNotFound();
    /** Regex allows "404 Not Found", "404 - Not Found", etc. without breaking */
    expect(screen.getByRole('heading', { name: /404 not found/i })).toBeInTheDocument();
  });

  /**
   * ## ✅ Description — error explanation text
   *
   * Verifies that a human-readable error message is visible on the page,
   * giving users context about why they landed on this page.
   */
  it('renders the error description', () => {
    renderNotFound();
    /** Partial case-insensitive match — tolerates minor copy changes */
    expect(
      screen.getByText(/the page you are looking for does not exist/i)
    ).toBeInTheDocument();
  });

  /**
   * ## ✅ Accessibility — alert role on error container
   *
   * Ensures the error container carries `role="alert"` so that assistive
   * technologies announce the 404 error automatically when the component mounts,
   * without requiring the user to navigate to it manually.
   */
  it('has role="alert" on the error container', () => {
    renderNotFound();
    /** `getByRole('alert')` maps to any element with role="alert" or <output> */
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  /**
   * ## ✅ Decorative content — search emoji
   *
   * Confirms the 🔍 emoji is rendered as visible text content.
   * Decorative elements like this are part of the designed visual identity
   * and should be caught if accidentally removed.
   */
  it('renders the search emoji', () => {
    renderNotFound();
    /** Exact text match — emoji characters are matched literally */
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  /**
   * ## ✅ Navigation — "Go back home" button present
   *
   * Verifies the recovery call-to-action button is rendered and accessible
   * by its visible label, giving users a clear path back to the home page.
   */
  it('renders a "Go back home" button', () => {
    renderNotFound();
    /** Case-insensitive match — tolerates "Go Back Home", "go back home", etc. */
    expect(screen.getByRole('button', { name: /go back home/i })).toBeInTheDocument();
  });

  /**
   * ## ✅ Interaction — "Go back home" button clickable without throwing
   *
   * Simulates a real user click on the button and asserts it does not throw.
   * `userEvent` fires the full event sequence (pointer, mouse, focus, click)
   * rather than a single synthetic event, catching more realistic failure modes.
   *
   * The `MemoryRouter` handles any internal navigation triggered by the click
   * gracefully, so no real browser URL or history stack is needed.
   */
  it('"Go back home" button is clickable without throwing', async () => {
    /** `userEvent.setup()` creates an isolated user-event instance for this test */
    const user = userEvent.setup();
    renderNotFound();
    /** Locate the button by accessible name before interacting with it */
    const button = screen.getByRole('button', { name: /go back home/i });
    /** `resolves.not.toThrow()` asserts the returned Promise fulfils without error */
    await expect(user.click(button)).resolves.not.toThrow();
  });

});
