'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider, ThemeProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface Props {
  children: ReactNode;
}

const client = new QueryClient();

function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <SessionProvider> {children}</SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
