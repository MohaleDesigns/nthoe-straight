"use client";

import { useCart } from "@/app/context/CartContext";
import { ShoppingBag, UserRound, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { cart, setIsCartOpen } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center hover:cursor-pointer">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-gray-900 font-serif">
              <Image 
                src="/logos/logo-nthoe'straight.png"
                alt="Nthoe'Straight Logo"
                width={100}
                height={100}
                className="w-auto h-16"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-widest">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-widest">
              Shop
            </Link>
            <Link href="/faq" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">
              FAQ
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div 
              className="relative"
              ref={userMenuRef}
              // onMouseEnter={() => isAuthenticated && setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-gray-900 transition-colors hover:cursor-pointer"
                >
                  <UserRound className="w-5 h-5" />
                </Link>
            </div>
            <button 
              className="relative text-gray-900 hover:text-gray-600 transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full h-screen left-0 top-20">
          <div className="px-4 pt-8 pb-3 space-y-6 flex flex-col items-center">
            <Link href="/" className="block text-2xl font-medium text-gray-900 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link href="#" className="block text-2xl font-medium text-gray-500 hover:text-gray-900 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
              Collections
            </Link>
            <Link href="#" className="block text-2xl font-medium text-gray-500 hover:text-gray-900 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            {/* <Link href={isAuthenticated ? "/profile" : "/login"} className="block text-2xl font-medium text-gray-500 hover:text-gray-900 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
              {isAuthenticated ? "Profile" : "Login"}
            </Link> */}
          </div>
        </div>
      )}
    </header>
  );
}
