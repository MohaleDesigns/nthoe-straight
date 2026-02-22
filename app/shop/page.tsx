"use client";

import { products } from "@/app/data/products";
import ProductCard from "@/app/components/ProductCard"
import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

type SortOption = "featured" | "price-low" | "price-high" | "newest";
type FilterCategory = "all" | "T-Shirts" | "Hoodies" | "Tracksuits" | "Shorts";

export default function ShopPage() {
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Get unique colors and sizes from products
  const allColors = Array.from(new Set(products.map(p => p.color)));
  const allSizes = Array.from(new Set(products.flatMap(p => p.size)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.size.includes(size));
    return categoryMatch && colorMatch && sizeMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const activeFilterCount = 
    (selectedCategory !== "all" ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Product Count */}
            <div className="text-sm font-medium text-gray-700">
              {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"}
            </div>

            {/* Sort and Filter Buttons */}
            <div className="flex items-center space-x-4">
              {/* Sort By */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Sort By</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "newest", label: "Newest" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value as SortOption);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          sortBy === option.value
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
              >
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Backdrop */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[60] transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col ${
        isFilterOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold tracking-tight">Filters</h2>
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Clear All */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline font-medium"
            >
              Clear All Filters ({activeFilterCount})
            </button>
          )}

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Category</h4>
            <div className="space-y-3">
              {["all", "T-Shirts", "Hoodies", "Tracksuits", "Shorts"].map(category => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category as FilterCategory)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {category === "all" ? "All Categories" : category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Color</h4>
            <div className="space-y-3">
              {allColors.map(color => (
                <label key={color} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleColor(color)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Size</h4>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 text-sm border rounded transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-all duration-300"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
