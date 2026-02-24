import Link from "next/link";
import { useState } from "react";
import { Product } from "@/app/data/products";
import { useCart } from "@/app/context/CartContext";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.size[0]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative flex flex-col bg-[#F6F5F8]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-3/4 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          width={1000}
          height={1000}
          loading="eager"
          className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
        
        {/* Quick Add Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 translate-y-full transition-transform duration-300 ease-in-out ${isHovered ? "translate-y-0" : ""}`}
          onClick={(e) => e.preventDefault()}
        >
          <div className="flex justify-center space-x-2 mb-3">
            {product.size.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`w-8 h-8 flex items-center justify-center text-xs font-medium border transition-colors ${
                  selectedSize === size 
                    ? "border-black bg-black text-white" 
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, selectedSize);
            }}
            className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Add to Cart - R{product.price.toLocaleString()}
          </button>
        </div>
      </Link>
      
      <div className="mt-4 p-3 flex justify-between items-start border-t border-gray-100">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link href={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.color}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm font-semibold text-gray-900">R{product.price.toLocaleString()}</p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, selectedSize);
            }}
            className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"
            aria-label="Add to cart"
          >
             <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
