import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sun Air Warranty System',
  description: 'Warranty registration and lookup portal for Sun Air',
  icons: {
    icon: '/sunair-logo.png',
    shortcut: '/sunair-logo.png',
    apple: '/sunair-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}