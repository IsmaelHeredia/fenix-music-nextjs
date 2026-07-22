import type { Metadata } from 'next';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: 'Fenix Music',
  description: 'Reproductor de música',
  icons: {
    icon: '/logo-fenix.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="h-screen max-h-screen md:h-dvh overflow-hidden select-none bg-[var(--bg-base)] text-[var(--text-primary)]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}