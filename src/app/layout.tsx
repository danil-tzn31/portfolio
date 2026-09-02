import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daniel Martin Tizon',
  description: 'Portfolio of Daniel Martin Tizon, a Computer Engineering graduate and developer.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
