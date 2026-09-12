import { MongoClient } from "mongodb";
import type { Product } from "@/types/product";

const mongoUrl = process.env.DB_URL;
const databaseName = process.env.DB_NAME || "maa-ganga-nursery";
let clientPromise: Promise<MongoClient> | undefined;

async function getClient() {
  if (!mongoUrl) throw new Error("DB_URL is not configured.");
  clientPromise ??= new MongoClient(mongoUrl, { serverSelectionTimeoutMS: 10000 }).connect();
  try {
    return await clientPromise;
  } catch (error) {
    clientPromise = undefined;
    throw error;
  }
}

function normalizeProduct(product: Product): Product {
  const category = ["Soil & compost", "Pots & planters", "Plant nutrition", "Garden tools"].includes(product.category)
    ? "Planting essential"
    : product.category;
  const tag = product.tag?.toLowerCase() === "popular" || product.tag?.toLowerCase() === "bestseller"
    ? "best seller"
    : product.tag?.toLowerCase();
  const images = Array.isArray(product.images) && product.images.length >= 3
    ? product.images
    : [product.image, `${product.image}&sat=-10`, `${product.image}&flip-h`];
  const createdAt = product.createdAt || new Date().toISOString();
  return { ...product, category, productType: category === "Planting essential" ? "garden-care" : "plant", tag, image: images[0], images, createdAt, updatedAt: product.updatedAt || createdAt };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const client = await getClient();
    const products = await client.db(databaseName).collection<Product>("products").find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
    return products.map(normalizeProduct);
  } catch (error) {
    console.error("Could not load products from MongoDB:", error);
    return [];
  }
}

export async function saveProducts(products: Product[]) {
  const client = await getClient();
  const collection = client.db(databaseName).collection<Product>("products");
  await collection.deleteMany({});
  if (products.length > 0) await collection.insertMany(products);
}