"use client"

import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import PrivateNavigation from "../components/PrivateNavigation";

export default function PrivatePagesLayout({children}: {children: React.ReactNode}) {
    const {user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!user && !loading) {
            router.push("/")
        }
    }, [user, loading])

    if(!user || loading) return null

    return (
        <>
            <PrivateNavigation />
            <main className="pt-20 min-h-screen">
                {children}
            </main>
        </>
    );
}