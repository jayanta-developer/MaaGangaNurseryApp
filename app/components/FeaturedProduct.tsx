import Link from "next/link";
import styles from "./storefront.module.css";

export function FeaturedProduct() {
  return (
    <section className={styles.featured} id="stories" aria-labelledby="featured-title">
      <div className={styles.featuredImage} aria-hidden="true" />
      <div className={styles.featuredCopy}>
        <p className={styles.eyebrow}>From our nursery</p>
        <h2 id="featured-title">Healthy roots.<br /><em>Happy homes.</em></h2>
        <p>Every plant is nurtured with patience and packed carefully so it arrives ready to grow in your home or garden.</p>
        <Link className={styles.outlineButton} href="#about">How we grow <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}