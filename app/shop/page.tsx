import Link from "next/link";
import { Header } from "@/app/components/Header";
import { ProductCard } from "@/app/components/ProductCard";
import { getProducts } from "@/lib/products";
import styles from "@/app/components/storefront.module.css";

export const dynamic = "force-dynamic";

const pageSize = 8;

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const products = await getProducts();
  const params = await searchParams;
  const category = params.category || "";
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products.filter((product) => product.productType === "plant");
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const requestedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const title = category === "Planting essential" ? "Garden care" : category ? `${category}s` : "All plants";
  const pageUrl = (page: number) => `/shop?${new URLSearchParams({ ...(category ? { category } : {}), page: String(page) }).toString()}`;

  return (
    <main className={styles.pageShell}>
      <Header />
      <div className={styles.content}>
        <section className={styles.launchSection} aria-labelledby="shop-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Browse the nursery</p>
              <h1 id="shop-title">{title}</h1>
            </div>
            <Link className={styles.textLink} href="/">Back home <span aria-hidden="true">↗</span></Link>
          </div>
          {visibleProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : <p className={styles.noResults}>No products are available in this category yet.</p>}
          {totalPages > 1 && <nav className={styles.pagination} aria-label="Product pages">
            {currentPage > 1 ? <Link href={pageUrl(currentPage - 1)}>← Previous</Link> : <span className={styles.paginationDisabled}>← Previous</span>}
            <div className={styles.pageNumbers}>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link className={page === currentPage ? styles.pageNumberActive : styles.pageNumber} href={pageUrl(page)} key={page} aria-current={page === currentPage ? "page" : undefined}>{page}</Link>)}</div>
            {currentPage < totalPages ? <Link href={pageUrl(currentPage + 1)}>Next →</Link> : <span className={styles.paginationDisabled}>Next →</span>}
          </nav>}
        </section>
      </div>
    </main>
  );
}