export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'T-Shirts' | 'Hoodies' | 'Tracksuits' | 'Shorts';
  color: string;
  size: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Nthoe'Straight Graphic Hand",
    price: 450, 
    description: "Egyptian cotton, tailored fit. The epitome of stealth wealth.",
    image: "/images/products/product-off-white.png",
    category: "T-Shirts",
    color: "Black",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Nthoe'Straight Graphic Hand",
    price: 450, 
    description: "A premium t-shirt made from 100% cotton. A garment of hight quality with a gsm of 305.",
    image: "/images/products/product-black.png",
    category: "T-Shirts",
    color: "Black",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Nthoe'Straight Graphic Hand",
    price: 450, 
    description: "A premium t-shirt made from 100% cotton. A garment of hight quality with a gsm of 305.",
    image: "/images/products/product-orange.png",
    category: "T-Shirts",
    color: "Orange",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    name: "Nthoe'Straight Graphic Hand",
    price: 380,
    description: "Deep V-cut for the confident gentleman. Merino wool blend.",
    image: "/images/products/product-maroon.png",
    category: "T-Shirts",
    color: "Maroon",
    size: ["M", "L", "XL", "XXL"]
  },
  {
    id: 5,
    name: "Nthoe'Straight Graphic Hand",
    price: 650,
    description: "Italian silk-cotton blend. Textured knit for breathable luxury.",
    image: "/images/products/product-blue.png",
    category: "T-Shirts",
    color: "Blue",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: 6,
    name: "Nthoe'Straight Graphic Hand",
    price: 420,
    description: "Aged to perfection. Soft, lived-in feel from day one.",
    image: "/images/products/product-red.png",
    category: "T-Shirts",
    color: "Red",
    size: ["M", "L"]
  },
  {
    id: 7,
    name: "Nthoe'Straight Graphic Hand",
    price: 380,
    description: "Deep V-cut for the confident gentleman. Merino wool blend.",
    image: "/images/products/product-maroon.png",
    category: "T-Shirts",
    color: "Maroon",
    size: ["M", "L", "XL", "XXL"]
  },
  {
    id: 8,
    name: "Nthoe'Straight Graphic Hand",
    price: 450, 
    description: "A premium t-shirt made from 100% cotton. A garment of hight quality with a gsm of 305.",
    image: "/images/products/product-orange.png",
    category: "T-Shirts",
    color: "Orange",
    size: ["S", "M", "L", "XL"]
  },
];
