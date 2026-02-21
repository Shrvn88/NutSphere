import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nutsphere.in'),
  title: {
    default: 'NutSphere - The Sphere of Superfoods | Premium Nuts & Seeds',
    template: '%s | NutSphere',
  },
  description: 'Shop premium quality dry fruits, nuts, and seeds online. NutSphere offers hygienically packed, FSSAI certified almonds, cashews, walnuts, and more with fast delivery across India.',
  keywords: ['nuts', 'dry fruits', 'seeds', 'almonds', 'cashews', 'walnuts', 'pistachios', 'superfoods', 'healthy snacks', 'NutSphere', 'premium quality', 'FSSAI certified'],
  authors: [{ name: 'NutSphere Agrocomm' }],
  creator: 'NutSphere',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nutsphere.in',
    siteName: 'NutSphere',
    title: 'NutSphere - The Sphere of Superfoods',
    description: 'Premium quality dry fruits, nuts, and seeds. Hygienically packed & FSSAI certified.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NutSphere - The Sphere of Superfoods',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutSphere - The Sphere of Superfoods',
    description: 'Premium quality dry fruits, nuts, and seeds online',
    creator: '@nutsphere',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ErrorBoundary>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}

