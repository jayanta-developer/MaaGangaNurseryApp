import { CategoryRail } from "./components/CategoryRail";
import { FeaturedProduct } from "./components/FeaturedProduct";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { ProductCard } from "./components/ProductCard";
import { products } from "@/data/products";
import styles from "./components/storefront.module.css";

export default function Home() {
  return (
    <main className={styles.pageShell}>
      <Header />
      <HeroBanner />

      <div className={styles.content}>
        <CategoryRail />

        <section className={styles.launchSection} id="new" aria-labelledby="launch-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Just landed</p>
              <h2 id="launch-title">New this week</h2>
            </div>
            <a className={styles.textLink} href="#all-products">
              View all <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.productGrid} id="all-products">
            {products.filter((product) => product.productType === "plant").slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className={styles.launchSection} aria-labelledby="garden-care-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Everything your garden needs</p>
              <h2 id="garden-care-title">Garden care essentials</h2>
            </div>
            <a className={styles.textLink} href="#garden-care-products">
              Shop garden care <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.productGrid} id="garden-care-products">
            {products.filter((product) => product.productType === "garden-care").map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <FeaturedProduct />
      </div>
    </main>
  );
}
