"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import styles from "./admin.module.css";

type FormProduct = Omit<Product, "id" | "image" | "images" | "care" | "createdAt" | "updatedAt"> & {
  id?: number;
  images: string[];
  care: string[];
};
const blank: FormProduct = {
  slug: "",
  productType: "plant",
  name: "",
  category: "",
  price: "",
  originalPrice: "",
  description: "",
  rating: "4.5",
  reviews: 4,
  tag: "",
  images: ["", "", ""],
  light: "",
  watering: "",
  height: "",
  potSize: "",
  care: [""],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const categories = ["Fruit plant", "Flower plant", "Indoor plant", "Planting essential"] as const;
const tags = ["best seller", "new", "limited", "organic"] as const;
const lightOptions = [
  "6+ hours of sunlight",
  "4–6 hours of sunlight",
  "6–8 hours of sunlight",
  "Bright, indirect sunlight",
  "For indoor and outdoor use",
] as const;
const wateringOptions = ["Once a week", "Twice a week", "Every 2–3 days", "Daily"] as const;
const potSizeOptions = ["6 inch pot", "8 inch nursery pot", "10 inch nursery pot", "12 inch pot", "2 kg pack", "5 kg bag", "One 3-piece set"] as const;
const heightOptions = Array.from({ length: 10 }, (_, index) => `${index + 1} ${index === 0 ? "foot" : "feet"}`);

export function AdminClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormProduct>(blank);
  const [slugEdited, setSlugEdited] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadProducts() {
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    if (response.ok) {
      setProducts(await response.json());
    } else if (response.status === 401) setAuthenticated(false);
    else setMessage("Login succeeded, but the product database is unavailable.");
  }

  useEffect(() => {
    fetch("/api/admin/products", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          setProducts(await response.json());
          setAuthenticated(true);
        }
      })
      .catch(() => undefined);
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setMessage("Incorrect password.");
      return;
    }
    setPassword("");
    setAuthenticated(true);
    await loadProducts();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const payload = {
      ...form,
      reviews: Number(form.reviews),
      images: form.images.filter(Boolean),
      care: form.care.filter(Boolean),
    };
    const response = await fetch("/api/admin/products", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    if (!response) {
      setBusy(false);
      setMessage("Could not connect to the product service. Please try again.");
      return;
    }
    const result = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) {
      setMessage(result?.message ?? "Could not save product.");
      return;
    }
    setForm(blank);
    setMessage("Product saved.");
    await loadProducts();
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this product?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setProducts((current) => current.filter((product) => product.id !== id));
      setForm(blank);
      setMessage("Product deleted.");
    }
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  }

  if (!authenticated)
    return (
      <main className={styles.loginPage}>
        <form className={styles.loginCard} onSubmit={login}>
          <p className={styles.kicker}>Maa Ganga Nursery</p>
          <h1>Admin access</h1>
          <p className={styles.muted}>
            Sign in to manage the product catalogue.
          </p>
          <label>
            Password
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {message && <p className={styles.error}>{message}</p>}
          <button type="submit">
            Enter dashboard <span>→</span>
          </button>
        </form>
      </main>
    );

  const update = (key: keyof FormProduct, value: string | number) =>
    setForm((current) => ({ ...current, [key]: value }));
  const updateName = (value: string) =>
    setForm((current) => ({
      ...current,
      name: value,
      slug: slugEdited ? current.slug : slugify(value),
    }));
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Maa Ganga Nursery</p>
          <h1>Product catalogue</h1>
        </div>
        <button className={styles.secondary} onClick={logout}>
          Sign out
        </button>
      </header>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <button
            className={styles.newButton}
            onClick={() => {
              setForm({
                ...blank,
                images: [...blank.images],
                care: [...blank.care],
              });
              setSlugEdited(false);
              setMessage("");
            }}
          >
            + New product
          </button>
          {products.map((product) => (
            <button
              className={
                form.id === product.id
                  ? styles.productActive
                  : styles.productItem
              }
              key={product.id}
              onClick={() => {
                setForm({
                  ...product,
                  images: [...product.images],
                  care: [...product.care],
                });
                setSlugEdited(true);
              }}
            >
              <span>{product.name}</span>
              <small>{product.category}</small>
            </button>
          ))}
        </aside>
        <section className={styles.editor}>
          <div className={styles.editorHeading}>
            <div>
              <p className={styles.kicker}>
                {form.id ? "Edit listing" : "New listing"}
              </p>
              <h2>{form.id ? form.name : "Add a product"}</h2>
            </div>
            {form.id && (
              <button
                className={styles.deleteButton}
                type="button"
                onClick={() => remove(form.id!)}
              >
                Delete product
              </button>
            )}
          </div>
          <form onSubmit={submit}>
            <div className={styles.fields}>
              <Field
                label="Product name"
                value={form.name}
                onChange={updateName}
              />
              <Field
                label="URL slug"
                value={form.slug}
                onChange={(value) => {
                  setSlugEdited(true);
                  update("slug", value);
                }}
              />
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) => {
                    const category = event.target.value;
                    setForm((current) => ({
                      ...current,
                      category,
                      productType: category === "Planting essential" ? "garden-care" : "plant",
                    }));
                  }}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <Field
                label="Price"
                value={form.price}
                onChange={(value) => update("price", value)}
              />
              <Field
                label="Original price"
                value={form.originalPrice ?? ""}
                onChange={(value) => update("originalPrice", value)}
              />
              <label>
                Tag
                <select
                  value={form.tag ?? ""}
                  onChange={(event) => update("tag", event.target.value)}
                >
                  <option value="">No tag</option>
                  {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                </select>
              </label>
              <label>
                Type
                <select
                  value={form.productType}
                  onChange={(event) => update("productType", event.target.value)}
                >
                  <option value="plant">Plant</option>
                  <option value="garden-care">Garden care</option>
                </select>
              </label>
              <Field
                label="Rating"
                value={form.rating}
                onChange={(value) => update("rating", value)}
              />
              <Field
                label="Reviews"
                value={String(form.reviews)}
                onChange={(value) => update("reviews", Number(value))}
                type="number"
              />
            </div>
            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                required
              />
            </label>
            <div className={styles.imageFields}>
              <h3>Product images</h3>
              {form.images.map((image, index) => (
                <label key={index}>
                  Image URL {index + 1}
                  <input
                    type="url"
                    value={image}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        images: current.images.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      }))
                    }
                    required={index < 3}
                  />
                </label>
              ))}
            </div>
            <div className={styles.fields}>
              <label>
                Light / best for
                <select
                  value={form.light}
                  onChange={(event) => update("light", event.target.value)}
                  required
                >
                  <option value="" disabled>Select an option</option>
                  {optionsWithCurrent(lightOptions, form.light).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <SelectField
                label="Watering / use with"
                value={form.watering}
                options={optionsWithCurrent(wateringOptions, form.watering)}
                onChange={(value) => update("watering", value)}
              />
              <SelectField
                label="Height / details"
                value={form.height}
                options={optionsWithCurrent(heightOptions, form.height)}
                onChange={(value) => update("height", value)}
              />
              <SelectField
                label="Pot size / pack"
                value={form.potSize}
                options={optionsWithCurrent(potSizeOptions, form.potSize)}
                onChange={(value) => update("potSize", value)}
              />
            </div>
            <div className={styles.careEditor}>
              <h3>Care instructions</h3>
              <p>Each field is saved as one separate care point.</p>
              {form.care.map((instruction, index) => (
                <div className={styles.careRow} key={index}>
                  <label>
                    Care point {index + 1}
                    <input
                      value={instruction}
                      onChange={(event) => setForm((current) => ({
                        ...current,
                        care: current.care.map((item, itemIndex) => itemIndex === index ? event.target.value : item),
                      }))}
                      required={index === 0}
                    />
                  </label>
                  {form.care.length > 1 && <button type="button" className={styles.removeButton} onClick={() => setForm((current) => ({ ...current, care: current.care.filter((_, itemIndex) => itemIndex !== index) }))} aria-label={`Remove care point ${index + 1}`}>Remove</button>}
                </div>
              ))}
              <button type="button" className={styles.addButton} onClick={() => setForm((current) => ({ ...current, care: [...current.care, ""] }))}>+ Add care point</button>
            </div>
            {message && (
              <p
                className={
                  message === "Product saved." || message === "Product deleted."
                    ? styles.success
                    : styles.error
                }
              >
                {message}
              </p>
            )}
            <button className={styles.saveButton} disabled={busy} type="submit">
              {busy ? "Saving..." : "Save product"} <span>→</span>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={label !== "Original price" && label !== "Tag"}
      />
    </label>
  );
}

function optionsWithCurrent(options: readonly string[], current: string) {
  return current && !options.includes(current) ? [current, ...options] : options;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} required>
        <option value="" disabled>Select an option</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
