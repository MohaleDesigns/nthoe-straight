"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Auth from "../components/auth/Auth";
import supabase from '@/app/api/client';

export default function LoginPage() {
  useEffect(() => {
    // Get the authenticated user
    async function authCheck() {
      const { data: user } = await supabase.auth.getUser();
      console.log('GET:user ', user)
    }

    authCheck()
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <div className="max-w-md">
          <Link href="/" className="block mb-8">
            <Image
              src="/logos/logo-nthoe'straight.png"
              alt="Nthoe'Straight Logo"
              width={200}
              height={200}
              className="w-auto h-24 mx-auto"
            />
          </Link>
          <h1 className="text-4xl font-serif font-bold text-gray-900 text-center mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center">
            Sign in to access your account and continue shopping
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <Auth />
      </div>
    </div>
  );
}
