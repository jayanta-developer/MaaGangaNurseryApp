"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import styles from "./product-detail.module.css";

export function ProductDetail({ product }: { product: Product }) {
  const isGardenCare = product.productType === "garden-care";
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isLightboxOpen]);

  const gallery = product.images;

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/#shop">{isGardenCare ? "Garden care" : "Plants"}</Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <div className={styles.productLayout}>
        <section
          className={styles.gallery}
          aria-label={`${product.name} image gallery`}
        >
          <button
            className={styles.mainImage}
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label={`Open ${product.name} image full screen`}
            style={{ backgroundImage: `url("${selectedImage}")` }}
          >
            {product.tag && <span className={styles.tag}>{product.tag}</span>}
          </button>
          <div className={styles.thumbnails}>
            {gallery.map((image, index) => (
              <button
                className={
                  selectedImage === image
                    ? styles.thumbnailActive
                    : styles.thumbnail
                }
                key={image}
                onClick={() => setSelectedImage(image)}
                aria-label={`View product image ${index + 1}`}
              >
                <span style={{ backgroundImage: `url("${image}")` }} />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.summary}>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.productTitle}>{product.name}</p>
          <div className={styles.rating}>
            <span aria-hidden="true">★★★★★</span> <b>{product.rating}</b>{" "}
            <a href="#reviews">{product.reviews} customer reviews</a>
          </div>
          <p className={styles.description}>
            {product.description}{" "}
            {isGardenCare
              ? "Selected to help you grow and care for a healthier garden."
              : "Carefully selected and nurtured at Maa Ganga Nursery."}
          </p>

          <div className={styles.priceRow}>
            <strong>₹{product.price}</strong>
            {product.originalPrice && (
              <>
                <s>₹{product.originalPrice}</s>
                <span className={styles.discount}>
                  Save {discount(product.price, product.originalPrice)}%
                </span>
              </>
            )}
          </div>
          <p className={styles.shipping}>
            Inclusive of taxes <span>·</span> Secure nursery packaging{" "}
            <span>·</span> Dispatches in 2–4 days
          </p>

          <button
            className={styles.buyButton}
            onClick={() => {
              setIsOrderSubmitted(false);
              setIsOrderOpen(true);
            }}
          >
            Buy now <span aria-hidden="true">→</span>
          </button>

          <div className={styles.quickFacts}>
            <Fact
              label={isGardenCare ? "Best for" : "Light"}
              value={product.light}
            />
            <Fact
              label={isGardenCare ? "Use with" : "Watering"}
              value={product.watering}
            />
            <Fact
              label={isGardenCare ? "Product details" : "Plant height"}
              value={product.height}
            />
            <Fact
              label={isGardenCare ? "Pack includes" : "Pot included"}
              value={product.potSize}
            />
          </div>
        </section>
      </div>

      <section className={styles.careSection} aria-labelledby="care-title">
        <div>
          <p className={styles.eyebrow}>
            {isGardenCare ? "Get the best from it" : "After your plant arrives"}
          </p>
          <h2 id="care-title">
            A little care goes
            <br />
            <em>a long way.</em>
          </h2>
          <p className={styles.careIntro}>
            {isGardenCare
              ? "Follow these simple steps to use your garden-care essential with confidence."
              : "Follow these simple steps to help your new plant settle in and grow strong."}
          </p>
        </div>
        <ol className={styles.careList}>
          {product.care.map((instruction, index) => (
            <li key={instruction}>
              <span>0{index + 1}</span>
              <InstructionText instruction={instruction}/>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={styles.reviewsSection}
        id="reviews"
        aria-labelledby="reviews-title"
      >
        <div className={styles.reviewsHeader}>
          <div>
            <p className={styles.eyebrow}>
              {isGardenCare
                ? "From our gardening community"
                : "From our plant family"}
            </p>
            <h2 id="reviews-title">Loved by growers</h2>
          </div>
          <div className={styles.reviewScore}>
            <strong>{product.rating}</strong>
            <span>★★★★★</span>
            <small>{product.reviews} reviews</small>
          </div>
        </div>
        <div className={styles.reviewGrid}>
          <Review
            name="Anita S."
            date="2 weeks ago"
            text="The plant arrived fresh and very well packed. It has already started growing new leaves."
          />
          <Review
            name="Rahul K."
            date="1 month ago"
            text="Exactly as described. The care instructions were genuinely helpful for a first-time plant parent."
          />
          <Review
            name="Meera P."
            date="2 months ago"
            text="Healthy roots and a beautiful plant. Maa Ganga Nursery is now my go-to nursery."
          />
        </div>
      </section>

      {isOrderOpen && (
        <OrderModal
          product={product}
          submitted={isOrderSubmitted}
          onClose={() => setIsOrderOpen(false)}
          onSubmit={() => setIsOrderSubmitted(true)}
        />
      )}

      {isLightboxOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} full-screen image`}
          onMouseDown={(event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains(styles.lightbox))
              setIsLightboxOpen(false);
          }}
        >
          <div
            className={styles.lightboxFrame}
            onMouseDown={(event) => {
              const target = event.target as HTMLElement;
              if (
                target.classList.contains(styles.lightboxFrame) ||
                target.closest(`.${styles.lightboxImage}`)
              ) {
                event.stopPropagation();
              }
            }}
            role="presentation"
          >
            <img
              className={styles.lightboxImage}
              src={selectedImage}
              alt={product.name}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function OrderModal({
  product,
  submitted,
  onClose,
  onSubmit,
}: {
  product: Product;
  submitted: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug: product.slug,
        name: formData.get("name"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        pinCode: formData.get("pinCode"),
        quantity: Number(formData.get("quantity")),
      }),
    }).catch(() => null);

    setIsSubmitting(false);

    if (!response) {
      setErrorMessage(
        "We could not connect to the order service. Please try again.",
      );
      return;
    }

    const result = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;
    if (!response.ok || !result?.success) {
      setErrorMessage(
        result?.message ?? "We could not submit your order. Please try again.",
      );
      return;
    }

    onSubmit();
  }

  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.orderModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close order form"
        >
          ×
        </button>
        {submitted ? (
          <div className={styles.successState}>
            <span className={styles.successIcon} aria-hidden="true">
              ✓
            </span>
            <p className={styles.eyebrow}>Order received</p>
            <h2 id="order-title">
              Thank you for
              <br />
              <em>your order.</em>
            </h2>
            <p>
              <strong>Order request submitted successfully.</strong> We have
              received your request for <strong>{product.name}</strong>. Our
              team will connect with you shortly to verify your order and
              confirm the delivery details.
            </p>
            <button className={styles.confirmButton} onClick={onClose}>
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <p className={styles.eyebrow}>Manual order request</p>
            <h2 id="order-title">
              Tell us where to
              <br />
              <em>send your plant.</em>
            </h2>
            <div className={styles.orderProduct}>
              <span style={{ backgroundImage: `url("${product.image}")` }} />
              <div>
                <strong>{product.name}</strong>
                <small>
                  {product.price} · {product.category}
                </small>
              </div>
            </div>
            <form className={styles.orderForm} onSubmit={handleSubmit}>
              <label>
                Customer name
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </label>
              <label>
                Delivery address
                <textarea
                  name="address"
                  placeholder="House / street / village / city"
                  rows={3}
                  required
                />
              </label>
              <label>
                PIN code
                <input
                  name="pinCode"
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit PIN code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </label>
              <div className={styles.quantityField}>
                <span>Quantity</span>
                <div
                  className={styles.quantityControl}
                  aria-label="Product quantity"
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <input type="hidden" name="quantity" value={quantity} />
              {errorMessage && (
                <p className={styles.formError} role="alert">
                  {errorMessage}
                </p>
              )}
              <button
                className={styles.confirmButton}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting request..."
                ) : (
                  <>
                    Submit order request <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
            <p className={styles.formNote}>
              No online payment is needed. We will call you to confirm the
              order.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function discount(price: string, originalPrice: string) {
  const current = Number(price.replace(/[^0-9]/g, ""));
  const original = Number(originalPrice.replace(/[^0-9]/g, ""));
  return Math.round(((original - current) / original) * 100);
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Review({
  name,
  date,
  text,
}: {
  name: string;
  date: string;
  text: string;
}) {
  return (
    <article className={styles.review}>
      <div className={styles.reviewTop}>
        <strong>{name}</strong>
        <span>★★★★★</span>
      </div>
      <small>{date}</small>
      <p>{text}</p>
    </article>
  );
}

function InstructionText({ instruction }: { instruction: string }) {
  const idx = instruction.indexOf(':');

  if (idx === -1) {
    // no colon found, just render as-is
    return <p>{instruction}</p>;
  }

  const boldPart = instruction.slice(0, idx + 1); // includes the colon
  const restPart = instruction.slice(idx + 1);

  return (
    <p>
      <strong>{boldPart}</strong>
      {restPart}
    </p>
  );
}
