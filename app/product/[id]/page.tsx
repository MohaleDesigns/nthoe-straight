"use client";

import { useParams } from "next/navigation";
import { products } from "@/app/data/products";
import { useCart } from "@/app/context/CartContext";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import NotFound from "@/app/not-found";
import Image from "next/image";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));
  
  const [selectedSize, setSelectedSize] = useState<string>(product ? product.size[0] : "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <NotFound />;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
  };

  return (
    <div className="pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
             <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <nav className="text-sm text-gray-500 mb-6 uppercase tracking-widest">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-black">{product.category}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-2xl font-medium text-gray-900 mb-8">
              R{product.price.toLocaleString()}
            </p>

            <div className="prose prose-sm text-gray-500 mb-10 leading-relaxed">
              <p>{product.description}</p>
              <p className="mt-4">
                Made from premium materials ensuring comfort and durability. 
                Perfect for any occasion, this piece defines modern luxury.
              </p>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <span className="block text-sm font-bold uppercase tracking-widest mb-4">Select Size</span>
              <div className="flex space-x-3">
                {product.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <div className="flex items-center border border-gray-200 w-32 justify-between px-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-500 hover:text-black"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-500 hover:text-black"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>In stock and ready to ship</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Free shipping on orders over R1,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
