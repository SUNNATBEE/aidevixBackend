'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { Toaster } from 'react-hot-toast';
import { LangProvider } from '@/context/LangContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SoundProvider } from '@/context/SoundContext';
import { checkAuthStatus } from '@/store/slices/authSlice';

function AuthBootstrap() {
  useEffect(() => {
    store.dispatch(checkAuthStatus() as any);
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      <ThemeProvider>
        <LangProvider>
          <SoundProvider>
            {children}
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: '#12141f',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                },
              }}
            />
          </SoundProvider>
        </LangProvider>
      </ThemeProvider>
    </Provider>
  );
}
