// app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '../context/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-neutral-50 text-gray-900 overflow-hidden">
                {/* Sidebar - hidden on small screens, toggled with sidebarOpen */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Topbar with toggle */}
                    <Topbar setSidebarOpen={setSidebarOpen} />

                    {/* Page content */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </ProtectedRoute>
    );
}
