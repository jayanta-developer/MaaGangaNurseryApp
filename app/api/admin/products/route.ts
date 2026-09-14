import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getProducts, saveProducts } from "@/lib/products";
import type { Product } from "@/types/product";

function text(value: unknown, max = 500) {
  return typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= max
    ? value.trim()
    : "";
}

const categories = [
  "Fruit plant",
  "Flower plant",
  "Indoor plant",
  "Planting essential",
];
const tags = ["best seller", "new", "limited", "organic"];
const wateringOptions = [
  "Once a week",
  "Twice a week",
  "Every 2–3 days",
  "Daily",
];
const potSizeOptions = [
  "6 inch pot",
  "8 inch nursery pot",
  "10 inch nursery pot",
  "12 inch pot",
  "2 kg pack",
  "5 kg bag",
  "One 3-piece set",
];
const legacyPotSizes = ["8 inch pot", "10 inch nursery pot", "One terracotta tub"];
const heightOptions = Array.from(
  { length: 10 },
  (_, index) => `${index + 1} ${index === 0 ? "foot" : "feet"}`,
);
const legacyHeights = [
  "30–45 cm",
  "35–50 cm",
  "40–55 cm",
  "45–60 cm",
  "Feeds plants for 3–4 months",
  "12 inch diameter",
  "Feeds soil for 6 weeks",
  "Trowel, fork and pruner",
];

function productFrom(
  body: Record<string, unknown>,
  id: number,
  timestamps: Pick<Product, "createdAt" | "updatedAt">,
): Product | null {
  const images = Array.isArray(body.images)
    ? body.images.map((item) => text(item, 1000)).filter(Boolean)
    : [];
  const care = Array.isArray(body.care)
    ? body.care.map((item) => text(item, 300)).filter(Boolean)
    : [];
  const name = text(body.name, 120);
  const slug = text(body.slug, 160)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const category = text(body.category, 100);
  const tag = text(body.tag, 40);
  const watering = text(body.watering, 160);
  const height = text(body.height, 160);
  const potSize = text(body.potSize, 160);
  if (validationErrors(body).length > 0)
    return null;
  return {
    id,
    slug,
    productType: category === "Planting essential" ? "garden-care" : "plant",
    name,
    category,
    price: text(body.price, 40),
    originalPrice: text(body.originalPrice, 40) || undefined,
    description: text(body.description, 500),
    rating: text(body.rating, 10) || "0",
    reviews: Number.isInteger(Number(body.reviews)) ? Number(body.reviews) : 0,
    image: images[0],
    images,
    tag: tag || undefined,
    light: text(body.light, 160),
    watering,
    height,
    potSize,
    care,
    ...timestamps,
  };
}

function validationErrors(body: Record<string, unknown>) {
  const errors: string[] = [];
  const images = Array.isArray(body.images) ? body.images.map((item) => text(item, 1000)).filter(Boolean) : [];
  const care = Array.isArray(body.care) ? body.care.map((item) => text(item, 300)).filter(Boolean) : [];
  const category = text(body.category, 100);
  const isGardenCare = category === "Planting essential";
  const tag = text(body.tag, 40);
  const watering = text(body.watering, 160);
  const height = text(body.height, 160);
  const potSize = text(body.potSize, 160);
  if (!text(body.name, 120)) errors.push("product name");
  if (!text(body.slug, 160)) errors.push("slug");
  if (!categories.includes(category)) errors.push("category");
  if (tag && !tags.includes(tag)) errors.push("tag");
  if (!text(body.price, 40)) errors.push("price");
  if (!isGardenCare && !wateringOptions.includes(watering) && !["Every 2–3 days", "Moisten before planting", "Drainage hole included", "Water after applying", "Rinse after use"].includes(watering)) errors.push("watering / use with");
  if (!isGardenCare && !heightOptions.includes(height) && !legacyHeights.includes(height)) errors.push("height / details");
  if (!isGardenCare && !potSizeOptions.includes(potSize) && !legacyPotSizes.includes(potSize)) errors.push("pot size / pack");
  if (isGardenCare && !text(body.light, 160)) errors.push("best for");
  if (isGardenCare && !watering) errors.push("use with");
  if (isGardenCare && !height) errors.push("product details");
  if (isGardenCare && !potSize) errors.push("pack includes");
  if (images.length < 3) errors.push("at least three image URLs");
  if (care.length < 1) errors.push("at least one care point");
  return errors;
}

async function authorized() {
  if (!(await isAdmin()))
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await authorized();
  if (denied) return denied;
  try {
    return NextResponse.json(await getProducts(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Product database is unavailable. Check MongoDB Atlas network access and try again.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const denied = await authorized();
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  let products: Product[];
  try {
    products = await getProducts();
  } catch {
    return NextResponse.json(
      {
        message:
          "Product database is unavailable. Check MongoDB Atlas network access and try again.",
      },
      { status: 503 },
    );
  }
  const now = new Date().toISOString();
  const product =
    body &&
    productFrom(body, Math.max(0, ...products.map((item) => item.id)) + 1, {
      createdAt: now,
      updatedAt: now,
    });
  if (!product || products.some((item) => item.slug === product.slug))
    return NextResponse.json(
      {
        message: product ? "A product with this slug already exists." : `Please check: ${validationErrors(body ?? {}).join(", ")}.`,
      },
      { status: 400 },
    );
  products.push(product);
  try {
    await saveProducts(products);
  } catch {
    return NextResponse.json(
      {
        message:
          "Product database is unavailable. Check MongoDB Atlas network access and try again.",
      },
      { status: 503 },
    );
  }
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: Request) {
  const denied = await authorized();
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const id = Number(body?.id);
  let products: Product[];
  try {
    products = await getProducts();
  } catch {
    return NextResponse.json(
      {
        message:
          "Product database is unavailable. Check MongoDB Atlas network access and try again.",
      },
      { status: 503 },
    );
  }
  const index = products.findIndex((item) => item.id === id);
  const product =
    body &&
    productFrom(body, id, {
      createdAt: products[index]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  const duplicateSlug = product && products.some((item, itemIndex) => itemIndex !== index && item.slug === product.slug);
  if (index < 0 || !product || duplicateSlug)
    return NextResponse.json(
      { message: index < 0 ? "Product not found. Refresh the page and try again." : duplicateSlug ? "A product with this slug already exists." : `Please check: ${validationErrors(body ?? {}).join(", ")}.` },
      { status: 400 },
    );
  products[index] = product;
  try {
    await saveProducts(products);
  } catch {
    return NextResponse.json(
      {
        message:
          "Product database is unavailable. Check MongoDB Atlas network access and try again.",
      },
      { status: 503 },
    );
  }
  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const denied = await authorized();
  if (denied) return denied;
  const id = Number(new URL(request.url).searchParams.get("id"));
  const products = await getProducts();
  const remaining = products.filter((item) => item.id !== id);
  if (remaining.length === products.length)
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 },
    );
  await saveProducts(remaining);
  return NextResponse.json({ success: true });
}
