export type Category = {
  slug: string;
  name: string;
  image: string;
};

/**
 * Placeholder categories — swap in the real category names/images later.
 * The 30 placeholder products in src/data/products.ts are spread across
 * these 6 categories.
 */
export const CATEGORIES: Category[] = [
  { slug: "milk-pudding", name: "Milk Pudding", image: "/products/carmel.png" },
  { slug: "flan", name: "Flan", image: "/products/strawberry.png" },
  { slug: "custard", name: "Custard", image: "/products/Vanila.png" },
  { slug: "mousse", name: "Mousse", image: "/products/pista.png" },
  { slug: "parfait", name: "Parfait", image: "/products/carmel.png" },
  { slug: "cheesecake", name: "Cheesecake", image: "/products/strawberry.png" },
];
