import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';

import './globals.css';
import { AppShell } from '@/modules/shell/app-shell';
import { MagentProvider } from '@/providers/magent.provider';
import { ConnectionGate } from '@/providers/connection-gate';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Magent',
  description: 'Set the direction. Magent plans and builds toward it.',
  icons: { icon: '/favicon.svg' },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ConnectionGate>
          <MagentProvider>
            <AppShell>{children}</AppShell>
          </MagentProvider>
        </ConnectionGate>
      </body>
      <GoogleAnalytics gaId="G-8SNWPLW811" />
    </html>
  );
};

export default RootLayout;
