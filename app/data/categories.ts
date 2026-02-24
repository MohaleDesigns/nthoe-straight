interface Category {
  id: number;
  name: string;
  image: string;
  path: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "T-Shirts",
    image: "/images/products/product-off-white.png",
    path: "#",
  },
  {
    id: 2,
    name: "Hoodies",
    image: "/images/products/product-hoodie.png",
    path: "#",
  },
  {
    id: 3,
    name: "Trackpants",
    image: "/images/products/product-trackpant.png",
    path: "#",
  },
  {
    id: 4,
    name: "Shorts",
    image: "/images/products/product-short.png",
    path: "#",
  },
];