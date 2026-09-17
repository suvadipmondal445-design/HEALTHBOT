import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/state/AppContext';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { Navbar } from '@/components/Navbar';
import { DisclaimerFooter } from '@/components/DisclaimerFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HEALTHBOT — Prescription & Symptom Safety Prototype',
  description: 'Educational safety prototype for prescription images, medicine confirmation, and drug interaction evidence review.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-navy-900 antialiased`}>
        <AppProvider>
          <PrivacyBanner />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <DisclaimerFooter />
        </AppProvider>
      </body>
    </html>
  );
}
