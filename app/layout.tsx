import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import './globals.css';

export const metadata: Metadata = {
  title: '3rd i Visuals — Growth, marketing and AI',
  description:
    'From e-commerce and B2B customer acquisition to content, performance marketing and AI automation, 3rd i Visuals builds practical growth engines for businesses.',
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
