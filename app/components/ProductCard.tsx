import Link from "next/link";
import type { Product } from "@/types/product";
import styles from "./storefront.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={styles.productCard}>
      <Link className={styles.productImageWrap} href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <span className={styles.productImage} style={{ backgroundImage: `url("${product.image}")` }} />
        {product.category && <span className={styles.productTag}>{product.category}</span>}
      </Link>
      <div className={styles.productDetails}>
        <div className={styles.productTopline}>
          <div>
            <p className={styles.productCategory}>{product.tag}</p>
            <h3>
              <Link href={`/products/${product.slug}`} className={styles.productTitleLink}>
                {product.name}
              </Link>
            </h3>
          </div>
          <div className={styles.productPriceBlock}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
            <strong>{formatPrice(product.price)}</strong>
          </div>
        </div>
        <p className={styles.productDescription}>{product.description}</p>
        <div className={styles.rating} aria-label={`${product.rating} out of 5 stars, ${product.reviews} reviews`}>
          <span aria-hidden="true">★★★★★</span> {product.rating} <small>({product.reviews})</small>
        </div>
      </div>
    </article>
  );
}

function formatPrice(price: string) {
  return price.trim().startsWith("₹") ? price : `₹${price.trim()}`;
}