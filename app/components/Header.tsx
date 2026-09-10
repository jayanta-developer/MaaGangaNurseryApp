import Link from "next/link";
import styles from "./storefront.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Link className={styles.wordmark} href="/" aria-label="Maa Ganga Nursery home">
        Maa Ganga Nursery<span>.</span>
      </Link>

      <nav className={styles.navigation} aria-label="Main navigation">
        <Link className={styles.activeNav} href="#new">
          New plants
        </Link>
        <Link href="#shop">Shop</Link>
        <Link href="#stories">Our nursery</Link>
      </nav>

      <div className={styles.headerActions}>
        <label className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          <span className={styles.srOnly}>Search plants</span>
          <input type="search" placeholder="Search plants" />
        </label>
        <Link className={styles.accountLink} href="#account">Sign in</Link>
        <Link className={styles.cartButton} href="#cart" aria-label="Plant cart, 0 items">
          <span aria-hidden="true">□</span>
          <span>Bag</span>
          <b>0</b>
        </Link>
      </div>
    </header>
  );
}