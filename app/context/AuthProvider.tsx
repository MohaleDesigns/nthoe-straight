'use client';

import { createContext, useState, useEffect } from 'react';
import supabase from '@/app/api/client';
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user || null);
            setLoading(false);
        })

        const { data: listenForChanges } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null); // update user state when auth state changes
        });

        return () => {
            listenForChanges.subscription.unsubscribe();
        };
    }, []);

    const isAuthenticated = !!user;

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };