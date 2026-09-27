export type Category = {
  slug: string;
  name: string;
  image: string;
  tagline: string;
};

/**
 * Placeholder categories — swap in the real category names/images later.
 * The 30 placeholder products in src/data/products.ts are spread across
 * these 6 categories.
 */
export const CATEGORIES: Category[] = [
  {
    slug: "milk-pudding",
    name: "Milk Pudding",
    image: "/products/carmel.png",
    tagline: "Slow-set, cream-forward, the one that started it all.",
  },
  {
    slug: "flan",
    name: "Flan",
    image: "/products/strawberry.png",
    tagline: "Silky custard under a soft caramel mirror.",
  },
  {
    slug: "custard",
    name: "Custard",
    image: "/products/Vanila.png",
    tagline: "Classic, gently set, never overpowering.",
  },
  {
    slug: "mousse",
    name: "Mousse",
    image: "/products/pista.png",
    tagline: "Light, airy, whipped to hold its shape.",
  },
  {
    slug: "parfait",
    name: "Parfait",
    image: "/products/carmel.png",
    tagline: "Layered textures, built to be eaten slow.",
  },
  {
    slug: "cheesecake",
    name: "Cheesecake",
    image: "/products/strawberry.png",
    tagline: "Rich and tangy, no oven required.",
  },
];
