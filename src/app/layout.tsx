import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Cursor } from '@/components/chrome/Cursor';
import { Grain } from '@/components/chrome/Grain';
import { PageIndex } from '@/components/chrome/PageIndex';
import { GridOverlay } from '@/components/chrome/GridOverlay';
import { PrintDefs } from '@/components/chrome/marks/PrintDefs';
import { SmoothScroll } from '@/lib/smooth-scroll';
import './globals.css';

const montreal = localFont({
  variable: '--font-montreal',
  display: 'swap',
  src: [
    { path: '../../public/fonts/PPNeueMontreal-Hairline.woff2', weight: '100', style: 'normal' },
    { path: '../../public/fonts/PPNeueMontreal-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/PPNeueMontreal-Extrabold.woff2', weight: '800', style: 'normal' },
  ],
});

const montrealText = localFont({
  variable: '--font-montreal-text',
  display: 'swap',
  src: [
    { path: '../../public/fonts/PPNeueMontrealText-Book.woff2', weight: '400', style: 'normal' },
  ],
});

// Eiko carries body copy only, all of it below the fold.
const eiko = localFont({
  variable: '--font-eiko',
  display: 'swap',
  preload: false,
  src: [{ path: '../../public/fonts/PPEiko-Medium.woff2', weight: '500', style: 'normal' }],
});

export const metadata: Metadata = {
  title: 'Daniel Martin Tizon',
  description: 'Portfolio of Daniel Martin Tizon, a Computer Engineering graduate and developer.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${montreal.variable} ${montrealText.variable} ${eiko.variable}`}>
      <body>
        {children}
        <SmoothScroll />
        <PageIndex />
        <Cursor />
        <Grain />
        <PrintDefs />
        {process.env.NODE_ENV === 'development' && <GridOverlay />}
      </body>
    </html>
  );
}
