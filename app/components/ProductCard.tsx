import Link from "next/link";
import type { Product } from "@/types/product";
import styles from "./storefront.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={styles.productCard}>
      <Link className={styles.productImageWrap} href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <span className={styles.productImage} style={{ backgroundImage: `url("${product.image}")` }} />
        {product.tag && <span className={styles.productTag}>{product.tag}</span>}
        <span className={styles.wishlist} aria-label={`Save ${product.name}`} role="img">♡</span>
      </Link>
      <div className={styles.productDetails}>
        <div className={styles.productTopline}>
          <div>
            <p className={styles.productCategory}>{product.category}</p>
            <h3>{product.name}</h3>
          </div>
          <strong>{product.price}</strong>
        </div>
        <p className={styles.productDescription}>{product.description}</p>
        <div className={styles.rating} aria-label={`${product.rating} out of 5 stars, ${product.reviews} reviews`}>
          <span aria-hidden="true">★★★★★</span> {product.rating} <small>({product.reviews})</small>
        </div>
      </div>
    </article>
  );
}