export type Product = {
  slug: string;
  name: string;
  tagline: string;
  badge: string;
  price: number;
  description: string;
  image: string;
  accent: string;
  specs: { label: string; value: string }[];
};

/**
 * Placeholder copy/pricing — real content to be swapped in later.
 * Everything downstream reads from this one array.
 */
export const PRODUCTS: Product[] = [
  {
    slug: "signature-caramel",
    name: "Signature Caramel Pudding",
    tagline: "Our founding recipe, poured slow.",
    badge: "Hand-Torched",
    price: 6.5,
    description:
      "A rich, hand-torched caramel folded into silk-smooth custard. The one that started Derlings — refined for years until it earned the name signature.",
    image: "/products/carmel.png",
    accent: "#c17a3d",
    specs: [
      { label: "Flavor Notes", value: "Burnt sugar, cream, vanilla bean" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
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
    accent: "#7e9a5b",
    specs: [
      { label: "Flavor Notes", value: "Roasted pistachio, saffron, malai" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
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
    accent: "#c94f63",
    specs: [
      { label: "Flavor Notes", value: "Strawberry, cream, light vanilla" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
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
    accent: "#d8c19a",
    specs: [
      { label: "Flavor Notes", value: "Madagascar vanilla, fresh cream" },
      { label: "Net Weight", value: "150g" },
      { label: "Shelf Life", value: "5 days, refrigerated" },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getOtherProducts(slug: string): Product[] {
  return PRODUCTS.filter((product) => product.slug !== slug);
}
