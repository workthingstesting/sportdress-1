"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    if (auth) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-neon font-bold tracking-widest uppercase">
        SportDress Portal
      </div>
    </div>
  );
}
