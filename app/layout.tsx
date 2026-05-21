import type { Metadata, Viewport } from 'next';
import { Poppins, DM_Serif_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SessionProvider from '@/components/providers/SessionProvider';
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
  title: 'MeraRoom — Find Your Perfect Room in India',
  description:
    'Discover verified rooms for rent across India. Search by city, connect via WhatsApp, and move in hassle-free.',
  keywords: [
    'room rent',
    'PG',
    'flat rent',
    'India',
    'MeraRoom',
    'accommodation',
  ],
  authors: [{ name: 'MeraRoom' }],
  openGraph: {
    title: 'MeraRoom — Find Your Perfect Room in India',
    description:
      'Discover verified rooms for rent across India. Search by city, connect via WhatsApp, and move in hassle-free.',
    url: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
    siteName: 'MeraRoom',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeraRoom — Find Your Perfect Room in India',
    description:
      'Discover verified rooms for rent across India.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F2E1E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F2E1E',
              color: '#FFFFFF',
            },
            success: {
              iconTheme: {
                primary: '#16A34A',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
