"use client";

import Link from "next/link";
import { useState } from "react";
import { products } from "@/data/products";
import type { Product } from "@/types/product";
import styles from "./storefront.module.css";

export function Header() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = normalizedQuery
    ? products
      .filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 5)
    : [];

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
        <div className={styles.searchArea} aria-expanded={Boolean(query)}>
          <label className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          <span className={styles.srOnly}>Search plants</span>
            <input
              type="search"
              placeholder="Search plants"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-controls="product-suggestions"
            />
          </label>
          {query && (
            <div className={styles.suggestions} id="product-suggestions" role="listbox">
              {suggestions.length > 0 ? suggestions.map((product) => (
                <Suggestion key={product.id} product={product} onSelect={() => setQuery("")} />
              )) : <p className={styles.noResults}>No plants or garden-care products found.</p>}
            </div>
          )}
        </div>
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

function Suggestion({ product, onSelect }: { product: Product; onSelect: () => void }) {
  return (
    <Link className={styles.suggestion} href={`/products/${product.slug}`} onClick={onSelect} role="option">
      <span className={styles.suggestionImage} style={{ backgroundImage: `url("${product.image}")` }} />
      <span className={styles.suggestionCopy}>
        <strong>{product.name}</strong>
        <small>{product.category}</small>
      </span>
      <b>{product.price}</b>
    </Link>
  );
}