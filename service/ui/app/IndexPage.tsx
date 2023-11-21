import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/_features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function IndexPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
}
