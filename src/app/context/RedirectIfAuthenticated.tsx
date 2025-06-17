// components/RedirectIfAuthenticated.tsx
'use client';

import { useUser } from './UserContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;
    if (user) return null;

    return <>{children}</>;
}
