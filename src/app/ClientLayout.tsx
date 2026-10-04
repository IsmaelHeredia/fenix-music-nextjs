'use client';

import { useState } from 'react';
import { ThemeProvider, useTheme } from '@/components/ui/ThemeProvider';
import { PlayerProvider } from '@/context/PlaybackContext';
import { RadioPlayerProvider } from '@/context/RadioPlayerContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { TabTitleProvider } from '@/context/TabTitleContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { PlayerBar } from '@/components/player/PlayerBar';
import { TabTitle } from '@/components/player/TabTitle';
import { ToastContainer } from 'react-toastify';
import { AboutModal } from '@/components/modals/AboutModal';

function AboutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: 'var(--bg-card, rgba(255,255,255,0.05))',
        border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
        color: 'var(--text-secondary, rgba(255,255,255,0.6))',
      }}
      title="Acerca de"
    >
      <span className="text-sm">ℹ️</span>
    </button>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: 'var(--bg-card, rgba(255,255,255,0.05))',
        border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
        color: 'var(--text-secondary, rgba(255,255,255,0.6))',
      }}
      title="Cambiar tema"
    >
      <span className="text-sm transition-transform duration-500 ease-in-out hover:rotate-180">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}

function ToastContainerWithTheme() {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === 'dark' ? 'dark' : 'light'}
    />
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <RadioPlayerProvider>
          <PlayerProvider>
            <TabTitleProvider>
              <TabTitle />
              <div className="h-full flex flex-col gap-2 p-2 md:p-1 transition-colors duration-200">
                <div className="flex flex-1 gap-2 min-h-0 relative overflow-hidden">
                  <div className="flex-shrink-0 h-full flex flex-col">
                    <Sidebar />
                  </div>
                  <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
                    <AboutButton onClick={() => setIsAboutOpen(true)} />
                    <ThemeToggle />
                  </div>

                  <main
                    className="flex flex-col flex-1 rounded-xl overflow-y-auto fenix-content-scroll min-w-0"
                    style={{
                      background: 'var(--bg-surface, #121212)',
                      border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                    }}
                    role="main"
                  >
                    <div className="flex-1">
                      <div className="pt-4">{children}</div>
                    </div>
                  </main>
                </div>

                <div className="w-full shrink-0 pb-1">
                  <PlayerBar />
                </div>
              </div>

              <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
              <ToastContainerWithTheme />
            </TabTitleProvider>
          </PlayerProvider>
        </RadioPlayerProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}