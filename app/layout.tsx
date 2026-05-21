import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sun Air Warranty System',
  description: 'Warranty registration and lookup portal for Sun Air',
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