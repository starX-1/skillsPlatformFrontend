import { useEffect, useState } from 'react';
// import axios from 'axios';
import authApi from '../api/authApi/auth'
import { useRouter } from 'next/navigation';

export default function useAuth({ redirectTo = '/login', protectedRoute = false } = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(protectedRoute); // Only load on protected pages
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await authApi.decodeUser();
        setUser(res.user);
      } catch (error) {
        setUser(null);
        console.log(error);
        if (protectedRoute) router.push(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [protectedRoute, redirectTo, router]);

  return { user, loading, isAuthenticated: !!user };
}
