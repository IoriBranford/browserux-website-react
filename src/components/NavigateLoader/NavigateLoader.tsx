/**
 * # ⏳ NavigateLoader
 *
 * Progress indicator that renders during React Router route transitions.
 *
 * Subscribes to the router's navigation `state` via `useNavigation`. When a
 * transition begins (`state === 'loading'`), the loader appears immediately.
 * When the transition ends, hiding is intentionally deferred by 300 ms so that
 * a CSS exit animation can complete before the element is removed from the DOM,
 * and to avoid a flash when a navigation resolves almost instantly.
 *
 * Renders a single `<div>` styled as an animated progress bar, or `null` when
 * no transition is in flight.
 */

import { useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './NavigateLoader.module.css';

// ---------------------------------------------------------------------------- //
//
//  ### ⏳ Component
//
// ---------------------------------------------------------------------------- //

/**
 * ## ⏳ NavigateLoader
 *
 * Renders an animated top-of-page progress bar during route transitions.
 */
export default function NavigateLoader() {

  /** Current router navigation state — `'idle'`, `'loading'`, or `'submitting'` */
  const { state } = useNavigation();

  /** Controls DOM presence of the loader bar; deferred to false on transition end */
  const [showLoader, setShowLoader] = useState<boolean>(false);

  /**
   * ## 👁️ Visibility Effect
   *
   * Synchronises `showLoader` with the router's navigation lifecycle.
   */
  useEffect(() => {
    if (state === 'loading') {
      /** Navigation started — show the loader bar immediately */
      setShowLoader(true);
    } else {
      /**
       * Navigation ended — defer hiding by 300 ms.
       * This gives CSS exit animations time to complete and prevents a flash
       * when a route transition resolves before the next animation frame.
       */
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 300);

      /** Cancel the timeout if `state` changes again or the component unmounts */
      return () => clearTimeout(timeout);
    }
  }, [state]);

  /** Render the progress bar when a transition is in flight, otherwise render nothing */
  return showLoader ? <div className={styles.navigateLoader}></div> : null;

}
