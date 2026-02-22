import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function CategoryCard({
  categoryName,
  categoryImage,
  categoryPath,
}: {
  categoryName: string;
  categoryImage: string;
  categoryPath: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={categoryImage}
        alt={categoryName}
        width={1000}
        height={1000}
        loading="eager"
        className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out ${
          isHovered ? "scale-105" : "scale-100"
        }`}
      />
      <div className="absolute flex flex-col items-end justify-end inset-0 bg-black/10 p-4">
        <Link
          href={categoryPath}
          className="inline-block bg-white text-primary px-8 py-3.5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-gray-100 transition-colors"
        >
          Shop {categoryName}
        </Link>
      </div>
    </div>
  );
}
