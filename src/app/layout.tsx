import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PlatformProvider } from '@/context/PlatformContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SIM10 — Instant Virtual Number & SMS Verification Platform',
  description:
    'Instant virtual temporary numbers for Meesho, Telegram, OpenAI, Google and 200+ services. Built with wallet ledger, 5-minute hold protection, multi-provider routing and instant OTP delivery.',
  icons: {
    icon: '/sim10-icon.svg',
    shortcut: '/sim10-icon.svg',
    apple: '/sim10-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
        <PlatformProvider>{children}</PlatformProvider>
      </body>
    </html>
  );
}
