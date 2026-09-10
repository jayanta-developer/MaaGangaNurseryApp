import Link from "next/link";
import styles from "./storefront.module.css";

export function HeroBanner() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroImage} aria-hidden="true" />
      <div className={styles.heroContent}>
        <p className={styles.heroKicker}>Grown with care · Delivered with love</p>
        <h1 id="hero-title">Bring home<br /><em>a little green.</em></h1>
        <p className={styles.heroDescription}>
          Healthy flowering, fruit, and garden plants grown at Maa Ganga Nursery for every kind of home.
        </p>
        <Link className={styles.primaryButton} href="#new">
          Explore new plants <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <p className={styles.heroCaption}>01 / 03 <span>Plants for every season.</span></p>
    </section>
  );
}