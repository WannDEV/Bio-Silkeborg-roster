import styles from "../../styles/Navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <img src="/logo-bio-silkeborg.png" className={styles.logo} />
      </Link>
      <div className={styles.navbarLinks}>
        <Link href="/">
          <a className={styles.navbarLink}>Vagtplan</a>
        </Link>
        <Link href="#">
          <a className={styles.navbarLink}>Statistik</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
