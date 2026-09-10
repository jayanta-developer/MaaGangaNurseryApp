"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import styles from "./product-detail.module.css";

export function ProductDetail({ product }: { product: Product }) {
  const isGardenCare = product.productType === "garden-care";
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);

  const gallery = [
    product.image,
    `${product.image}&sat=-10`,
    `${product.image}&flip-h`,
  ];

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link><span>/</span><Link href="/#shop">{isGardenCare ? "Garden care" : "Plants"}</Link><span>/</span><strong>{product.name}</strong>
      </div>

      <div className={styles.productLayout}>
        <section className={styles.gallery} aria-label={`${product.name} image gallery`}>
          <div className={styles.mainImage} style={{ backgroundImage: `url("${selectedImage}")` }}>
            {product.tag && <span className={styles.tag}>{product.tag}</span>}
          </div>
          <div className={styles.thumbnails}>
            {gallery.map((image, index) => (
              <button className={selectedImage === image ? styles.thumbnailActive : styles.thumbnail} key={image} onClick={() => setSelectedImage(image)} aria-label={`View product image ${index + 1}`}>
                <span style={{ backgroundImage: `url("${image}")` }} />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.summary}>
          <p className={styles.category}>{product.category}</p>
          <h1>{product.name}</h1>
          <div className={styles.rating}><span aria-hidden="true">★★★★★</span> <b>{product.rating}</b> <a href="#reviews">{product.reviews} customer reviews</a></div>
          <p className={styles.description}>{product.description} {isGardenCare ? "Selected to help you grow and care for a healthier garden." : "Carefully selected and nurtured at Maa Ganga Nursery."}</p>

          <div className={styles.priceRow}>
            <strong>{product.price}</strong>
            {product.originalPrice && <><s>{product.originalPrice}</s><span className={styles.discount}>Save {discount(product.price, product.originalPrice)}%</span></>}
          </div>
          <p className={styles.shipping}>Inclusive of taxes <span>·</span> Secure nursery packaging <span>·</span> Dispatches in 2–4 days</p>

          <div className={styles.actionRow}>
            <div className={styles.quantity} aria-label="Quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className={styles.addButton}>Add to cart <span aria-hidden="true">→</span></button>
          </div>
          <button className={styles.buyButton}>Buy now</button>

          <div className={styles.quickFacts}>
            <Fact label={isGardenCare ? "Best for" : "Light"} value={product.light} />
            <Fact label={isGardenCare ? "Use with" : "Watering"} value={product.watering} />
            <Fact label={isGardenCare ? "Product details" : "Plant height"} value={product.height} />
            <Fact label={isGardenCare ? "Pack includes" : "Pot included"} value={product.potSize} />
          </div>
        </section>
      </div>

      <section className={styles.careSection} aria-labelledby="care-title">
        <div>
          <p className={styles.eyebrow}>{isGardenCare ? "Get the best from it" : "After your plant arrives"}</p>
          <h2 id="care-title">A little care goes<br /><em>a long way.</em></h2>
          <p className={styles.careIntro}>{isGardenCare ? "Follow these simple steps to use your garden-care essential with confidence." : "Follow these simple steps to help your new plant settle in and grow strong."}</p>
        </div>
        <ol className={styles.careList}>
          {product.care.map((instruction, index) => <li key={instruction}><span>0{index + 1}</span><p>{instruction}</p></li>)}
        </ol>
      </section>

      <section className={styles.reviewsSection} id="reviews" aria-labelledby="reviews-title">
        <div className={styles.reviewsHeader}><div><p className={styles.eyebrow}>{isGardenCare ? "From our gardening community" : "From our plant family"}</p><h2 id="reviews-title">Loved by growers</h2></div><div className={styles.reviewScore}><strong>{product.rating}</strong><span>★★★★★</span><small>{product.reviews} reviews</small></div></div>
        <div className={styles.reviewGrid}><Review name="Anita S." date="2 weeks ago" text="The plant arrived fresh and very well packed. It has already started growing new leaves." /><Review name="Rahul K." date="1 month ago" text="Exactly as described. The care instructions were genuinely helpful for a first-time plant parent." /><Review name="Meera P." date="2 months ago" text="Healthy roots and a beautiful plant. Maa Ganga Nursery is now my go-to nursery." /></div>
      </section>
    </main>
  );
}

function discount(price: string, originalPrice: string) {
  const current = Number(price.replace(/[^0-9]/g, ""));
  const original = Number(originalPrice.replace(/[^0-9]/g, ""));
  return Math.round(((original - current) / original) * 100);
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function Review({ name, date, text }: { name: string; date: string; text: string }) {
  return <article className={styles.review}><div className={styles.reviewTop}><strong>{name}</strong><span>★★★★★</span></div><small>{date}</small><p>{text}</p></article>;
}