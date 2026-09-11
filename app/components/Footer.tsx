import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.brandBlock}>
          <p className={styles.brand}>Maa Ganga Nursery<span>.</span></p>
          <p className={styles.tagline}>Healthy plants and garden care, grown with care.</p>
        </div>

        <div className={styles.contactBlock}>
          <p className={styles.label}>Need help?</p>
          <a href="tel:+917679624307">+91 76796 24307</a>
        </div>

        <div className={styles.metaBlock}>
          <span>Plants for every space</span>
          <span>Release 0.1.0</span>
        </div>
      </div>
    </footer>
  );
}