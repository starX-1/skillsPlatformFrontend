// components/RedirectIfAuthenticated.tsx
'use client';

import { useUser } from './UserContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
            </div>
        )
    }
    if (user) return null;

    return <>{children}</>;
}
