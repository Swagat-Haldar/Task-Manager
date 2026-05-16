"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing workspace...</p>
    </div>
  );
}
