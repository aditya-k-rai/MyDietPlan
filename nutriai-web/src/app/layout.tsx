import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NutriAI — AI-Powered Nutrition & Diet Planning Platform',
    template: '%s | NutriAI',
  },
  description:
    'NutriAI is a world-class AI-powered nutrition, diet planning, and medical nutrition platform. Get personalized diet plans, nutrition analysis, and expert guidance for your health goals.',
  keywords: [
    'diet plan', 'nutrition', 'AI diet planner', 'meal plan', 'calories', 'weight loss',
    'muscle gain', 'diabetes diet', 'medical nutrition', 'PCOS diet', 'Indian food nutrition',
  ],
  authors: [{ name: 'NutriAI' }],
  creator: 'NutriAI',
  metadataBase: new URL('https://nutriai.health'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nutriai.health',
    siteName: 'NutriAI',
    title: 'NutriAI — AI-Powered Nutrition & Diet Planning',
    description: 'Personalized diet plans powered by AI. Medically aware. Mobile-first. Free.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriAI — AI-Powered Diet Planning',
    description: 'Personalized diet plans powered by AI.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#065f46" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
