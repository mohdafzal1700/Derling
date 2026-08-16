import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/Premium/Navbar";
import { ProductDetail } from "@/components/Premium/ProductDetail";
import { PRODUCTS, getProduct } from "@/data/products";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Derlings — Signature Collection" };
  return {
    title: `${product.name} — Derlings`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <Navbar light />
      <ProductDetail key={product.slug} initialSlug={product.slug} />
    </>
  );
}
