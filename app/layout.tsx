import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/shared/Navigation';

export const metadata: Metadata = {
  title: 'Sales Forecast Tool',
  description: 'Team sales forecasting and pipeline management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
