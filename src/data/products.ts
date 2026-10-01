export type Product = {
  slug: string;
  name: string;
  tagline: string;
  badge: string;
  price: number;
  description: string;
  image: string;
  /** Gallery images for the product-detail page (placeholder: reuses `image` until real shots exist). */
  images: string[];
  accent: string;
  specs: { label: string; value: string }[];
  /** Base category slug (matches a slug prefix in src/data/categories.ts), e.g. "milk-pudding". */
  category: string;
};

/**
 * Placeholder copy/pricing — real content to be swapped in later.
 * Everything downstream reads from this one array.
 */
const CURATED_PRODUCTS: Product[] = [
  {
    slug: "signature-caramel",
    name: "Signature Caramel Pudding",
    tagline: "Our founding recipe, poured slow.",
    badge: "Hand-Torched",
    price: 6.5,
    description:
      "A rich, hand-torched caramel folded into silk-smooth custard. The one that started Derlings — refined for years until it earned the name signature.",
    image: "/products/carmel.png",
    images: ["/products/carmel.png", "/products/carmel.png", "/products/carmel.png", "/products/carmel.png"],
    accent: "#c17a3d",
    specs: [
      { label: "Flavor Notes", value: "Burnt sugar, cream, vanilla bean" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
    category: "milk-pudding",
  },
  {
    slug: "pista",
    name: "Pista Malai Pudding",
    tagline: "Roasted pistachio, real cream.",
    badge: "Roasted Pista",
    price: 6.5,
    description:
      "Roasted pistachios ground into a malai-rich base, finished with a light saffron note. Nutty, floral, never artificial-tasting.",
    image: "/products/pista.png",
    images: ["/products/pista.png", "/products/pista.png", "/products/pista.png", "/products/pista.png"],
    accent: "#7e9a5b",
    specs: [
      { label: "Flavor Notes", value: "Roasted pistachio, saffron, malai" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
    category: "milk-pudding",
  },
  {
    slug: "strawberry",
    name: "Strawberry Flan",
    tagline: "Real strawberries, no shortcuts.",
    badge: "Fresh Strawberry",
    price: 6.0,
    description:
      "Fresh strawberry puree layered through a soft-set flan. Bright and fruit-forward, with none of the cough-syrup sweetness of flavoring.",
    image: "/products/strawberry.png",
    images: [
      "/products/strawberry.png",
      "/products/strawberry.png",
      "/products/strawberry.png",
      "/products/strawberry.png",
    ],
    accent: "#c94f63",
    specs: [
      { label: "Flavor Notes", value: "Strawberry, cream, light vanilla" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
    category: "flan",
  },
  {
    slug: "vanilla",
    name: "Classic Vanilla Bean",
    tagline: "The quiet one that changes your mind.",
    badge: "Madagascar Vanilla",
    price: 5.75,
    description:
      "Madagascar vanilla bean steeped into cream and set slow. Simple on paper, the one regulars reorder most.",
    image: "/products/Vanila.png",
    images: ["/products/Vanila.png", "/products/Vanila.png", "/products/Vanila.png", "/products/Vanila.png"],
    accent: "#d8c19a",
    specs: [
      { label: "Flavor Notes", value: "Madagascar vanilla, fresh cream" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
    category: "custard",
  },
];

const PLACEHOLDER_CATEGORIES = ["milk-pudding", "flan", "custard", "mousse", "parfait", "cheesecake"];

/**
 * Placeholder products — reuse the curated photos/copy under new slugs so the
 * catalog has enough items (30 total) to test grids and category filtering.
 * Swap in real products later.
 */
const PLACEHOLDER_PRODUCTS: Product[] = Array.from({ length: 30 - CURATED_PRODUCTS.length }, (_, i) => {
  const template = CURATED_PRODUCTS[i % CURATED_PRODUCTS.length];
  const n = i + 1;
  return {
    ...template,
    slug: `${template.slug}-${n}`,
    name: `${template.name} ${n}`,
    category: PLACEHOLDER_CATEGORIES[i % PLACEHOLDER_CATEGORIES.length],
  };
});

/** The curated range shown in the hero carousel and product-detail pages. */
export const PRODUCTS: Product[] = CURATED_PRODUCTS;

/** Curated + placeholder products (30 total) — used by the category grid. */
export const ALL_PRODUCTS: Product[] = [...CURATED_PRODUCTS, ...PLACEHOLDER_PRODUCTS];

export function getProduct(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((product) => product.slug === slug);
}

export function getOtherProducts(slug: string): Product[] {
  return PRODUCTS.filter((product) => product.slug !== slug);
}
