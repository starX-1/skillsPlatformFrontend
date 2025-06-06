'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import authApi from '@/api/authApi/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Logging in with:', { email, password });

    try {
      const response = await authApi.login(email, password); // 
      setLoading(false);
      console.log('Login response:', response);

      toast.success(response.message || 'Login successful');

      // Redirect after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      setError('Login failed. Please check your credentials and try again.');
    }
  };



  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">

          <span className='flex items-center justify-center mt-2 mb-2'>
            <Image src="/og-image.svg" alt="TrainHub" width={200} height={100} />
          </span>
          Welcome Back
        </h1>

        {/* {error && (
          toast.error(error)
        )} */}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 rounded-xl bg-[#2563EB] py-3 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            Log In
          </button>
          {/* add a divider here  */}
          <div className="flex items-center justify-between mt-4">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="w-full border-gray-300" />
          </div>
          <button
            type="button"
            onClick={() => router.push('/auth/google')}
            className="w-full flex justify-center items-center gap-2 rounded-xl bg-white border border-[#F5910A] py-3 text-gray-900 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 transition"
          >
            <FcGoogle />
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="font-medium text-[#2563EB] hover:text-[#2563EB] hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
