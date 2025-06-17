// components/ProtectedRoute.tsx
'use client';

import { useUser } from './UserContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login'); // Redirect if not logged in
        }
    }, [user, loading, router]);

    if (loading) return <div className="p-8 text-center">Checking authentication...</div>;
    if (!user) return null; // Prevent flashing unauthorized content

    return <>{children}</>;
}
