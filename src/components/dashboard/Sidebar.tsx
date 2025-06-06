'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaTachometerAlt,
    FaBook,
    FaChartBar,
    FaCalendarAlt,
    FaCog,
    FaSignOutAlt,
    FaTimes,
} from 'react-icons/fa';

const navItems = [
    { label: 'Dashboard', icon: <FaTachometerAlt />, href: '/dashboard' },
    { label: 'Courses', icon: <FaBook />, href: '/dashboard/courses' },
    { label: 'Charts', icon: <FaChartBar />, href: '/dashboard/charts' },
    { label: 'Calendar', icon: <FaCalendarAlt />, href: '/dashboard/calendar' },
    { label: 'Settings', icon: <FaCog />, href: '/dashboard/settings' },
];

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block md:flex`}
            >
                {/* Close button on mobile */}
                <div className="flex items-center justify-between p-4 md:hidden">
                    <Image src="/og-image.svg" alt="Logo" width={200} height={60} />
                    <button
                        className="text-gray-600 hover:text-red-500"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Logo */}
                <div className="hidden md:flex justify-center p-6">
                    <Image src="/og-image.svg" alt="Logo" width={200} height={60} />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2 my-1 rounded-lg transition-colors 
              ${pathname === item.href ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setSidebarOpen(false)} // Close on mobile
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Log Out - Now at the bottom */}
                <div className="px-4 pb-6 mt-auto">
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600">
                        <FaSignOutAlt />
                        Log Out
                    </button>
                </div>
            </aside>
        </>
    );
}