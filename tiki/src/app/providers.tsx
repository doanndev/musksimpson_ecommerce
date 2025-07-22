'use client';
import { initialOptions } from '@/config/paypal';
import { getLocalStorageItem } from '@/lib/utils';
import theme from '@/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { NextUIProvider } from '@nextui-org/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactLenis } from 'lenis/react';
import NextTopLoader from 'nextjs-toploader';
import { type ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import socketService from '../lib/socketService';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 5 * 1000,
      retry: false,
    },
  },
});

export interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userInforString = getLocalStorageItem('auth-storage');
  const userInfor = userInforString ? JSON.parse(userInforString) : null;
  const userId = userInfor?.state?.user?.uuid ?? '';

  useEffect(() => {
    socketService.connect();

    socketService.on('connect', () => {
      console.log('Socket connected, emitting joinRoom...');
      socketService.emit('joinRoom', userId);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <NextUIProvider>
      <ReactLenis
        root
        options={{
          lerp: 0.08,
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.8,
          touchMultiplier: 0.8,
        }}
      >
        <PayPalScriptProvider options={initialOptions}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NextTopLoader
              color='#1255f3'
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing='ease'
              speed={200}
              shadow={false}
            />
            <Toaster richColors position='top-center' duration={5000} />
            <QueryClientProvider client={queryClient}>
              <>{isMounted ? children : <></>}</>
              <ReactQueryDevtools buttonPosition='bottom-left' initialIsOpen={false} />
            </QueryClientProvider>
          </ThemeProvider>
        </PayPalScriptProvider>
      </ReactLenis>
    </NextUIProvider>
  );
}

export default Providers;
