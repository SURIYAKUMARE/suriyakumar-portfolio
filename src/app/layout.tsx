import type { Metadata } from 'next';
import { Inter, Playfair_Display, Space_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Starfield from '@/components/Starfield';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Suriyakumar E — Data Analytics | AI & ML Engineering Portfolio',
  description:
    'Cinematic portfolio of Suriyakumar E. AI & ML engineering, data analytics, hardware tracking, and predictive systems showcase.',
  keywords: [
    'Suriyakumar E',
    'Data Analytics',
    'AI & ML Engineer',
    'Rathinam Technical Campus',
    'SpaceEdu',
    'Python',
    'SQL',
    'Power BI',
    'OpenCV',
  ],
  authors: [{ name: 'Suriyakumar E' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${spaceMono.variable}`}>
      <body className="bg-[#0a0e17] text-zinc-100 antialiased selection:bg-accent-cyan/30 selection:text-white relative">
        {/* Deep space starfield background */}
        <Starfield />

        {/* Subtle tactile grain/noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Custom Magnetic Cursor */}
        <CustomCursor />

        {/* Lenis Smooth Scrolling Context */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
