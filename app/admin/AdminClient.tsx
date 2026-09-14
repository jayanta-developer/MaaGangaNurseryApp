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
  const [categorySearchOpen, setCategorySearchOpen] = useState<Record<string, boolean>>({});
  const [categorySearchQueries, setCategorySearchQueries] = useState<Record<string, string>>({});

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
  const groupedProducts = products.reduce<Record<string, Product[]>>(
    (groups, product) => {
      (groups[product.category] ??= []).push(product);
      return groups;
    },
    {},
  );
  const categoryGroups = Object.entries(groupedProducts).sort(
    ([categoryA], [categoryB]) => {
      const rankA = categories.indexOf(categoryA as (typeof categories)[number]);
      const rankB = categories.indexOf(categoryB as (typeof categories)[number]);
      return (rankA < 0 ? categories.length : rankA) - (rankB < 0 ? categories.length : rankB);
    },
  );
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
          {categoryGroups.map(([category, categoryProducts]) => (
            <details key={category}>
              <summary
                style={{
                  alignItems: "center",
                  color: "#697168",
                  cursor: "pointer",
                  display: "flex",
                  fontSize: 10,
                  fontWeight: 600,
                  justifyContent: "space-between",
                  letterSpacing: 1,
                  padding: "8px 4px",
                  textTransform: "uppercase",
                }}
              >
                <span>{category}</span>
                <span>{categoryProducts.length}</span>
              </summary>
              <div
                style={{
                  alignItems: "center",
                  border: categorySearchOpen[category] ? "1px solid #dde2d8" : 0,
                  display: "flex",
                  gap: 6,
                  margin: categorySearchOpen[category] ? "2px 0 6px" : 0,
                  minHeight: categorySearchOpen[category] ? 30 : 0,
                  padding: categorySearchOpen[category] ? "2px 5px" : 0,
                }}
              >
                <button
                  type="button"
                  aria-label={categorySearchOpen[category] ? `Close search for ${category}` : `Search ${category} products`}
                  onClick={() => {
                    const isOpen = categorySearchOpen[category];
                    setCategorySearchOpen((current) => ({ ...current, [category]: !isOpen }));
                    if (isOpen) {
                      setCategorySearchQueries((current) => ({ ...current, [category]: "" }));
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#3f794b",
                    cursor: "pointer",
                    fontSize: 17,
                    lineHeight: 1,
                    padding: "3px 4px",
                  }}
                >
                  {categorySearchOpen[category] ? "x" : "⌕"}
                </button>
                {categorySearchOpen[category] && (
                  <input
                    autoFocus
                    value={categorySearchQueries[category] ?? ""}
                    onChange={(event) => setCategorySearchQueries((current) => ({ ...current, [category]: event.target.value }))}
                    placeholder="Search products"
                    aria-label={`Search ${category} products`}
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "#20221d",
                      flex: 1,
                      font: "inherit",
                      fontSize: 11,
                      minWidth: 0,
                      outline: 0,
                      padding: "4px 2px",
                    }}
                  />
                )}
              </div>
              <div style={{ maxHeight: 392, overflowY: "auto" }}>
                {categoryProducts
                  .filter((product) => product.name.toLowerCase().includes((categorySearchQueries[category] ?? "").trim().toLowerCase()))
                  .map((product) => (
                  <button
                    className={
                      form.id === product.id
                        ? styles.productActive
                        : styles.productItem
                    }
                    style={{ alignItems: "center", display: "flex", gap: 10,width:"100%" }}
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
                    <span
                      aria-hidden="true"
                      style={{
                        backgroundColor: "#e8ede4",
                        backgroundImage: `url("${product.images[0] || product.image}")`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        display: "block",
                        flex: "0 0 48px",
                        height: 48,
                        width: 48,
                      }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <span>{product.name}</span>
                      <small>{product.category}</small>
                    </span>
                  </button>
                  ))}
              </div>
            </details>
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
                    const isGardenCare = category === "Planting essential";
                    setForm((current) => ({
                      ...current,
                      category,
                      productType: isGardenCare ? "garden-care" : "plant",
                      light: isGardenCare ? "" : current.light,
                      watering: isGardenCare ? "" : current.watering,
                      height: isGardenCare ? "" : current.height,
                      potSize: isGardenCare ? "" : current.potSize,
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
            {form.productType === "plant" && (
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
            )}
            {form.productType === "garden-care" && (
              <div className={styles.fields}>
                <Field
                  label="Best for"
                  value={form.light}
                  onChange={(value) => update("light", value)}
                />
                <Field
                  label="Use with"
                  value={form.watering}
                  onChange={(value) => update("watering", value)}
                />
                <Field
                  label="Product details"
                  value={form.height}
                  onChange={(value) => update("height", value)}
                />
                <Field
                  label="Pack includes"
                  value={form.potSize}
                  onChange={(value) => update("potSize", value)}
                />
              </div>
            )}
            <div className={styles.careEditor}>
              <h3>{form.productType === "plant" ? "Care instructions" : "Usage instructions"}</h3>
              <p>Each field is saved as one separate instruction.</p>
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
