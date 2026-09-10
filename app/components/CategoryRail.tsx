import Link from "next/link";
import styles from "./storefront.module.css";

const categories = [
  { name: "All plants", count: "148", image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=600&q=80" },
  { name: "Flower plants", count: "42", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80" },
  { name: "Fruit plants", count: "36", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80" },
  { name: "Indoor plants", count: "29", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80" },
  { name: "Garden care", count: "41", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80" },
];

export function CategoryRail() {
  return (
    <section className={styles.categorySection} id="shop" aria-labelledby="category-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Browse the nursery</p>
          <h2 id="category-title">Find the right plant for you</h2>
        </div>
        <span className={styles.scrollHint}>Scroll to explore <span aria-hidden="true">→</span></span>
      </div>
      <div className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <Link className={`${styles.categoryCard} ${index === 0 ? styles.categoryCardActive : ""}`} href="#all-products" key={category.name}>
            <span className={styles.categoryImage} style={{ backgroundImage: `url("${category.image}")` }} />
            <span className={styles.categoryName}>{category.name}</span>
            <span className={styles.categoryCount}>{category.count} pieces</span>
          </Link>
        ))}
      </div>
    </section>
  );
}