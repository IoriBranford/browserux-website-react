/**
 * # 🧪 routes-list.test.js
 *
 * Unit test suite for the `routes-list.js` module, which exports the flat array
 * of route paths used by the application router.
 *
 * Validates the module's contract from the outside — no knowledge of its internal
 * implementation is assumed. Each test targets a distinct invariant:
 *
 * - Shape: the export is an array of strings
 * - Presence: known required routes (`/`, `/about`) exist in the list
 * - Integrity: no duplicate entries, all paths start with `/`
 *
 * Run with: `vitest` or `vitest run tests/routes-list.test.js`
 */

/**
 * Vitest's core test primitives.
 * `describe` groups related tests, `it` defines individual cases,
 * and `expect` drives the assertions.
 */
import { describe, it, expect } from 'vitest';

/**
 * The module under test — a flat array of route path strings
 * (e.g. `['/', '/about']`) consumed by the app's router configuration.
 */
import routesList from '../src/routes-list.js';

// ---------------------------------------------------------------------------- //
//
//  ### 🗺️ Route List Test Suite
//  Contract tests for the exported routes array — shape, required entries,
//  uniqueness, and path format invariants.
//
// ---------------------------------------------------------------------------- //

describe('routes-list', () => {

  /**
   * ## ✅ Shape — Array export
   *
   * Confirms the module's default export is an array.
   * Guards against accidental refactors that change the export shape
   * (e.g. exporting an object or a router config map instead).
   */
  it('exports an array', () => {
    /** `Array.isArray` is used instead of `instanceof` to work across realms */
    expect(Array.isArray(routesList)).toBe(true);
  });

  /**
   * ## ✅ Shape — Non-empty
   *
   * Ensures the array contains at least one route.
   * An empty routes list would silently break the entire router at runtime.
   */
  it('is not empty', () => {
    /** Any value greater than 0 passes — length must not be 0 */
    expect(routesList.length).toBeGreaterThan(0);
  });

  /**
   * ## ✅ Presence — Home route
   *
   * Asserts that the root route `/` is present.
   * Missing this entry would cause the app to have no default landing page.
   */
  it('contains the home route /', () => {
    /** Exact string match — `/` must appear as a standalone entry */
    expect(routesList).toContain('/');
  });

  /**
   * ## ✅ Presence — About route
   *
   * Asserts that `/about` is registered in the route list.
   * Prevents the About page from silently disappearing if the route is removed.
   */
  it('contains the about route /about', () => {
    /** Exact string match — `/about` must appear as a standalone entry */
    expect(routesList).toContain('/about');
  });

  /**
   * ## ✅ Integrity — No duplicate routes
   *
   * Verifies that each route path appears exactly once.
   * Duplicate routes could cause ambiguous router matching or double-rendered pages.
   */
  it('has no duplicate routes', () => {
    /** `Set` deduplicates by value; spread restores it to an array for `.length` comparison */
    const unique = [...new Set(routesList)];
    /** If lengths differ, at least one entry was removed by deduplication → duplicates exist */
    expect(unique.length).toBe(routesList.length);
  });

  /**
   * ## ✅ Format — Paths start with `/`
   *
   * Ensures every entry is an absolute path.
   * Relative paths (e.g. `about` instead of `/about`) would cause router mismatches.
   */
  it('all entries start with /', () => {
    routesList.forEach(route => {
      /** Regex `^\/` matches any string whose first character is a forward slash */
      expect(route).toMatch(/^\//);
    });
  });

  /**
   * ## ✅ Format — All entries are strings
   *
   * Guards against entries accidentally being `null`, `undefined`, or objects
   * (which could occur if route config objects are mistakenly included instead
   * of just their `path` strings).
   */
  it('all entries are strings', () => {
    routesList.forEach(route => {
      /** `typeof` check is intentional — stricter than duck-typing */
      expect(typeof route).toBe('string');
    });
  });

});
