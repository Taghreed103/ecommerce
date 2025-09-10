"use client";

import { useSession } from "next-auth/react";

export function useClientToken() {
  const { data: session } = useSession();
  return session?.user?.token || null;
}

export function getClientTokenSync() {
  if (typeof window === 'undefined') return null;
  
  // Try to get token from session storage or cookies
  const token = sessionStorage.getItem('auth-token') || 
                document.cookie
                  .split('; ')
                  .find(row => row.startsWith('next-auth.session-token='))
                  ?.split('=')[1];
  
  return token || null;
}
