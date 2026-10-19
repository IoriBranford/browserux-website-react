/**
 * # 🧪 tests/setup.js
 *
 * Global test setup file executed by Vitest before every test suite.
 *
 * Extends Jest-compatible `expect` with custom DOM matchers from
 * `@testing-library/jest-dom`, enabling assertions such as `toBeInTheDocument`,
 * `toHaveClass`, `toBeVisible`, and `toHaveTextContent` directly on DOM nodes.
 *
 * Registered in `vite.config.js` (or `vitest.config.js`) via the
 * `test.setupFiles` option so it runs automatically — no manual import needed
 * inside individual test files.
 */

/**
 * Augments Vitest's `expect` with the full set of `@testing-library/jest-dom`
 * custom matchers. Must be imported here (not in test files) to apply globally.
 */
import '@testing-library/jest-dom';