import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Political Network Explorer',
  description: 'Interactive map of political influence on X — who matters, why they matter, and how they connect.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
