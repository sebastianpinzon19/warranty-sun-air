import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sun Air Warranty",
  description: "Register and download Sun Air warranty certificates",
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
