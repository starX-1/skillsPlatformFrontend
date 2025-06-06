// app/not-found.tsx
'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-screen flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
            <Link href="/" className="text-white bg-blue-700 px-6 py-2 rounded hover:bg-blue-700">
                Go Home
            </Link>
        </div>
    );
}
