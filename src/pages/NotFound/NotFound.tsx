/**
 * # 🔍 NotFound
 *
 * Error boundary page rendered for unmatched routes and loader errors.
 *
 * Registered as the `errorElement` on the root route in `routes.tsx`, so it
 * handles both explicit 404s (no route matched the URL) and any error thrown
 * by a child route's loader or component.
 */

import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

// ---------------------------------------------------------------------------- //
//
//  ### 🔍 Component
//
// ---------------------------------------------------------------------------- //

/**
 * ## 🔍 NotFound
 *
 * Full-page error display shown for unmatched URLs or route-level errors.
 */
export default function NotFound() {

  /** Imperative navigation function — used to redirect to home on button click */
  const navigate = useNavigate();

  return (
    <main className={`page ${styles.errorPage}`}>

      <div role="alert" aria-live="polite">
        <span className={`${styles.emoji}`}>🔍</span>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>

      <button onClick={() => navigate('/')}>
        Go back home
      </button>

    </main>
  );
}
