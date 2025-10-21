'use client';

import { AuthProvider } from '../lib/hooks/use-auth'; // If using .tsx file (same import)

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
