"use client";

import Image from "next/image";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="w-full lg:container lg:mx-auto lg:px-8">
      <div className="relative h-[400px] md:h-[600px] w-full flex items-center mb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/call-to-action (1).png"
            alt="CTA Background"
            width={1000}
            height={1000}
            loading="eager"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl text-left text-white">
            <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 font-light">
              Wear clothes with confidence
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              Redefine Your Wardrobe
            </h2>
            <p className="text-base md:text-lg text-gray-200 mb-8 font-light leading-relaxed">
              Discover the perfect balance of comfort and style with our latest
              collection. Meticulously crafted for the modern individual who
              values substance and simplicity.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-primary px-8 py-3.5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-gray-100 hover:cursor-pointer transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
