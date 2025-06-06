'use client';

import { Bell, Menu, Search, User } from 'lucide-react';

export default function Topbar({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
            {/* Left: Menu Button on Mobile */}
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                <span className="hidden md:block text-xl font-semibold text-gray-800">Dashboard</span>
            </div>

            {/* Right: Search + Icons */}
            <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
                <div className="w-8 h-8 bg-amber-500 text-white flex items-center justify-center rounded-full font-bold">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
