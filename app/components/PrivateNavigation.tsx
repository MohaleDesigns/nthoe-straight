"use client";

import { UserRound, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export default function PrivateNavigation() {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
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
          <Link href="/profile" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-widest">
              Profile
            </Link>
            <Link href="/orders" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-widest">
              Orders
            </Link> 
          </nav>

          {/* User Icon with Dropdown */}
          <div className="flex items-center space-x-6">
            <div 
              className="relative"
              ref={userMenuRef}
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-400 hover:text-gray-900 transition-colors hover:cursor-pointer"
              >
                <UserRound className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 truncate font-light">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors hover:cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
