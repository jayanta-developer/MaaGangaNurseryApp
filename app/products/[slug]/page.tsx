import { notFound } from "next/navigation";
import { Header } from "@/app/components/Header";
import { getProducts } from "@/lib/products";
import { ProductDetail } from "./ProductDetail";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  return <><Header /><ProductDetail product={product} /></>;
}