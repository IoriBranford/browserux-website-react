/**
 * # 🧪 vitest.config.mjs
 *
 * Vitest configuration for the BrowserUX Starter (React) test suite.
 *
 * Imported from `vitest/config` (not `vite`) so the config object is typed
 * with Vitest-specific options, while still being composable with Vite plugins.
 *
 * Key settings:
 * - `happy-dom` as the DOM environment — faster and more spec-compliant than jsdom
 * - Global test setup via `tests/setup.js` (loads `@testing-library/jest-dom` matchers)
 * - `globals: true` makes `describe`, `it`, `expect` available without explicit imports
 * - Test discovery scoped to `tests/**` to avoid picking up source-tree test utilities
 */

/**
 * Vitest's typed config factory — provides IntelliSense for `test.*` options.
 * Imported from `vitest/config` rather than `vite` to include Vitest-specific types.
 */
import { defineConfig } from 'vitest/config';

/**
 * React plugin required so Vitest can parse and transform JSX in test files.
 * Without this, `.jsx` test files would fail to compile.
 */
import react from '@vitejs/plugin-react';

// ---------------------------------------------------------------------------- //
//
//  ### 🧪 Vitest Config Export
//  Test environment, global setup, and file discovery options
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🧪 defineConfig
 *
 * Vitest configuration object.
 *
 * Key sections:
 * - `plugins`: React JSX transform — required for test files using JSX syntax.
 * - `test.environment`: DOM implementation used to simulate browser APIs in Node.
 * - `test.setupFiles`: runs before every test suite to register global matchers.
 * - `test.globals`: exposes test primitives globally to avoid repetitive imports.
 * - `test.include`: glob pattern controlling which files Vitest treats as test suites.
 */
export default defineConfig({
  /** React plugin enables JSX compilation inside test files */
  plugins: [react()],
  test: {
    /**
     * `happy-dom` provides a lightweight, spec-compliant DOM implementation.
     * It is faster than `jsdom` and sufficient for React Testing Library's needs.
     */
    environment: 'happy-dom',

    /**
     * Runs `tests/setup.js` before every test suite.
     * That file imports `@testing-library/jest-dom`, which extends `expect`
     * with DOM matchers (`toBeInTheDocument`, `toHaveClass`, etc.) globally.
     */
    setupFiles: ['./tests/setup.js'],

    /**
     * Exposes `describe`, `it`, `test`, `expect`, `vi`, and `beforeEach` /
     * `afterEach` globally — no import needed inside test files.
     * Test files in this project import them explicitly anyway, but `globals: true`
     * keeps compatibility with third-party utilities that assume a global test API.
     */
    globals: true,

    /** Restrict test discovery to files matching `*.test.js` or `*.test.jsx` under `tests/` */
    include: ['tests/**/*.test.{js,jsx}']
  }
});
