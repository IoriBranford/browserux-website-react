import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

/**
 * ## 🔗 getLinkClass
 *
 * Returns the CSS module class for active `NavLink` elements.
 * Returns `undefined` (not a falsy string) for inactive links so React
 * omits the `className` attribute entirely rather than setting it to `""`.
 *
 * @param isActive - Whether the link's path matches the current URL
 * @returns Active CSS class or undefined
 */
const getLinkClass = ({
  isActive,
}: {
  isActive: boolean;
}): string | undefined => (isActive ? styles.active : undefined);

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div>
        {/** Active class applied automatically by NavLink when path matches '/' */}
        <NavLink to="/" className={getLinkClass}>
          Home
        </NavLink>

        {/** Visual separator between nav links */}
        <span className={styles.separator}> | </span>

        {/** Active class applied automatically by NavLink when path matches '/about' */}
        <NavLink to="/about" className={getLinkClass}>
          About
        </NavLink>
      </div>

      {/** Custom web component — registered via the useEffect lazy import above */}
      <browserux-theme-switcher></browserux-theme-switcher>
    </nav>
  );
}
