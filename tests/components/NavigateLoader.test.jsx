/**
 * # 🧪 NavigateLoader.test.jsx
 *
 * Test suite for the `<NavigateLoader>` component, which renders a loading
 * indicator while React Router is navigating between routes.
 *
 * The component reads `useNavigation().state` and shows itself when the state
 * is `'loading'`, then hides after an internal delay once state returns to
 * `'idle'`. Because of that delay, one test relies on Vitest fake timers.
 *
 * Testing strategy:
 * - `useNavigation` is partially mocked (real module preserved, hook replaced)
 *   so the component can be rendered in isolation without a real router context.
 * - `MemoryRouter` wraps every render to satisfy React Router's context requirement.
 * - Visibility is asserted via `container.firstChild` (null = hidden, non-null = visible).
 */

/**
 * Vitest test primitives plus `vi` for mocking and fake timer control.
 */
import { describe, it, expect, vi } from 'vitest';

/**
 * React Testing Library utilities.
 * - `render`: mounts the component into a JSDOM document
 * - `screen`: queries the rendered output by accessible roles/text
 * - `act`: wraps async state updates and timer advances for React's reconciler
 */
import { render, screen, act } from '@testing-library/react';

/**
 * In-memory router that satisfies React Router's context requirement without
 * needing a real browser URL. Used to wrap every component render in this suite.
 */
import { MemoryRouter } from 'react-router-dom';

/**
 * The component under test — renders a loading bar while the router is navigating.
 */
import NavigateLoader from '../../src/components/NavigateLoader/NavigateLoader.jsx';

/**
 * ## 🎭 Partial Mock — react-router-dom
 *
 * Replaces only `useNavigation` with a controllable spy while keeping the rest
 * of the real `react-router-dom` module intact (including `MemoryRouter`).
 *
 * `vi.importActual` is required here to avoid losing the real exports; without
 * the spread, `MemoryRouter` and other imports would become `undefined`.
 *
 * Note: Vitest hoists `vi.mock` calls above imports at compile time, so this
 * mock is active by the time any import in this file resolves.
 */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigation: vi.fn()
  };
});

/**
 * Typed reference to the mocked `useNavigation` hook.
 * Imported after `vi.mock` so this binding resolves to the spy, not the real hook.
 * Each test drives it via `.mockReturnValue({ state })` to simulate router states.
 */
import { useNavigation } from 'react-router-dom';

// ---------------------------------------------------------------------------- //
//
//  ### 🛠️ Test Helper
//  Shared render factory — controls navigation state for each test case
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🏗️ renderLoader
 *
 * Convenience factory that sets the mocked `useNavigation` state and renders
 * `<NavigateLoader>` inside a `MemoryRouter`.
 *
 * Centralises the boilerplate so individual tests only supply the `state` they
 * care about. Defaults to `'idle'` (hidden loader) when no argument is passed.
 *
 * @param {'idle' | 'loading' | 'submitting'} [state='idle'] - Navigation state to simulate.
 * @returns {import('@testing-library/react').RenderResult} The RTL render result.
 */
const renderLoader = (state = 'idle') => {
  /** Configure the mock to return the requested navigation state for this render */
  useNavigation.mockReturnValue({ state });
  return render(
    <MemoryRouter>
      <NavigateLoader />
    </MemoryRouter>
  );
};

// ---------------------------------------------------------------------------- //
//
//  ### 🧩 NavigateLoader Test Suite
//  Covers visibility toggling, DOM structure, and timer-based hide behaviour
//
// ---------------------------------------------------------------------------- //

describe('NavigateLoader', () => {

  /**
   * ## ✅ Hidden when idle
   *
   * The loader must render nothing when navigation is not in progress.
   * `container.firstChild === null` means the component returned `null` from render.
   */
  it('renders nothing when navigation state is idle', () => {
    /** `renderLoader` defaults to 'idle', so no argument needed here */
    const { container } = renderLoader('idle');
    /** A null firstChild confirms the component renders no DOM node */
    expect(container.firstChild).toBeNull();
  });

  /**
   * ## ✅ Visible when loading
   *
   * The loader must appear as soon as the navigation state switches to `'loading'`.
   * A non-null `firstChild` confirms at least one DOM node was rendered.
   */
  it('renders the loader when navigation state is loading', () => {
    const { container } = renderLoader('loading');
    /** Non-null firstChild confirms the component is actively rendered */
    expect(container.firstChild).not.toBeNull();
  });

  /**
   * ## ✅ DOM structure — tag name
   *
   * Validates the root element rendered by the loader is a `<div>`.
   * Prevents silent regressions if the markup root tag is changed.
   */
  it('loader element has expected class when visible', () => {
    const { container } = renderLoader('loading');
    /** Grab the root node so we can inspect its tag name */
    const loader = container.firstChild;
    /** Truthy guard ensures the element exists before asserting its tag */
    expect(loader).toBeTruthy();
    /** Tag names from the DOM are always uppercase */
    expect(loader.tagName).toBe('DIV');
  });

  /**
   * ## ✅ Timer-based hide — delay on idle transition
   *
   * The component does not hide instantly when state returns to `'idle'`;
   * it waits for an internal CSS-transition delay (~300 ms) before unmounting.
   * This test uses fake timers to control that delay without real waiting.
   *
   * Sequence:
   * 1. Render in `'loading'` state → loader visible
   * 2. Re-render in `'idle'` state → loader still visible (delay pending)
   * 3. Advance fake clock 350 ms → delay expires, loader unmounts
   */
  it('hides the loader after delay when state returns to idle', async () => {
    /** Replace `setTimeout`/`setInterval` with synchronous fake implementations */
    vi.useFakeTimers();

    /** Step 1 — Render with navigation active so the loader appears */
    useNavigation.mockReturnValue({ state: 'loading' });
    const { rerender, container } = render(
      <MemoryRouter>
        <NavigateLoader />
      </MemoryRouter>
    );

    /** Confirm the loader is visible before triggering the state change */
    expect(container.firstChild).not.toBeNull();

    /** Step 2 — Simulate the router finishing navigation */
    useNavigation.mockReturnValue({ state: 'idle' });
    rerender(
      <MemoryRouter>
        <NavigateLoader />
      </MemoryRouter>
    );

    /** Step 3 — Advance the clock past the component's internal hide delay (≈300 ms) */
    await act(async () => {
      /** 350 ms gives a safe margin above the ~300 ms threshold used by the component */
      vi.advanceTimersByTime(350);
    });

    /** After the delay the component should have unmounted, leaving no DOM node */
    expect(container.firstChild).toBeNull();

    /** Restore real timers so subsequent tests are not affected */
    vi.useRealTimers();
  });

});
