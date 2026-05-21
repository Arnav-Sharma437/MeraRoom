import type { Metadata, Viewport } from 'next';
import { Poppins, DM_Serif_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/providers/ThemeProvider';
import SessionProvider from '@/components/providers/SessionProvider';
import AppShell from '@/components/layout/AppShell';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MeraRoom — Find Your Perfect Room in Dharamshala',
  description:
    'Search verified rooms, PGs and hostels across Dharamshala, Himachal Pradesh. Connect directly with owners on WhatsApp.',
  keywords: [
    'room rent Dharamshala',
    'PG McLeod Ganj',
    'Bhagsu rooms',
    'Dharamkot accommodation',
    'MeraRoom',
  ],
  authors: [{ name: 'MeraRoom' }],
  openGraph: {
    title: 'MeraRoom — Find Your Perfect Room in Dharamshala',
    description:
      'Verified rooms across Dharamshala — McLeod Ganj, Bhagsu, Dharamkot & more.',
    url: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
    siteName: 'MeraRoom',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeraRoom — Dharamshala Rooms',
    description: 'Find verified rooms in Dharamshala on WhatsApp.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/meraroom-icon.svg',
    apple: '/meraroom-icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F2E1E',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <SessionProvider>
            <AppShell>{children}</AppShell>
          </SessionProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'dark:!bg-brand-dark-deep dark:!text-white',
              style: { background: '#0F2E1E', color: '#FFFFFF' },
              success: {
                iconTheme: { primary: '#16A34A', secondary: '#FFFFFF' },
              },
              error: {
                iconTheme: { primary: '#D4AF37', secondary: '#FFFFFF' },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
