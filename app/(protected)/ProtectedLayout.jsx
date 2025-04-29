'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/check-token`, {
          credentials: 'include',
        });

        if (res.ok) {
          setIsVerified(true);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        router.replace('/login');
      }
    };

    checkToken();
  }, [router]);

  if (!isVerified) return null;

  return <>{children}</>;
}
