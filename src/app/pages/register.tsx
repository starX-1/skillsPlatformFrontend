'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import authApi from '@/api/authApi/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [full_name, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await authApi.register(full_name, email, password);
            if (response.userId) {
                toast.success(response.message || 'Registration successful');
                router.push('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
                <Image
                    src="/og-image.svg"
                    alt="TrainHub"
                    width={200}
                    height={100}
                    className="mx-auto mb-2"
                />
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* full_name */}
                    <div>
                        <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="full_name"
                            type="text"
                            autoComplete="name"
                            value={full_name}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition duration-200 ease-in-out"
                            placeholder="John Doe"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition duration-200 ease-in-out"
                            placeholder="you@example.com"
                            aria-describedby="email-error"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition duration-200 ease-in-out"
                            placeholder="••••••••"
                            aria-describedby="password-error"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition duration-200 ease-in-out"
                            placeholder="••••••••"
                            aria-describedby="password-error"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2563EB] text-white py-2 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-[#F59E0B] hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
