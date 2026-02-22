"use client";

import { products } from "./data/products";
import { categories } from "./data/categories";
import ProductCard from "./components/ProductCard";
import CallToAction from "./components/CallToAction";
import Image from "next/image";
import Link from "next/link";
import CategoryCard from "./components/CategoryCard";

export default function Home() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gray-900 text-white overflow-hidden mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Hero Background"
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full w-full flex flex-col justify-center items-center text-center p-4 mx-auto bg-black/30 backdrop-blur-sm">
          <span className="uppercase tracking-[0.3em] text-sm md:text-base mb-4 font-light">
            The New Standard
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight">
            Elevated Essentials
          </h1>
          <Link href={'/shop'} className="bg-white text-black px-10 py-4 font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 font-light text-center">
          Nthoe&apos;Straight Summer 2026
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16 text-primary">
          Our Latest Collection
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif mb-2">No products found</h3>
            <p className="text-gray-500">
              No available products found at the moment, please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <CallToAction />

      {/* Categories Section */}
      <div id="collection" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 font-light text-center">
          Explore our categories
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16 text-primary">
          Shop by Categories
        </h2>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif mb-2">No categories found</h3>
            <p className="text-gray-500">
              No available categories found at the moment, please try again
              later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                categoryName={category.name}
                categoryImage={category.image}
                categoryPath={category.path}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}