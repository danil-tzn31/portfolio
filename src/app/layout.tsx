import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Cursor } from '@/components/chrome/Cursor';
import { Grain } from '@/components/chrome/Grain';
import { PageIndex } from '@/components/chrome/PageIndex';
import { GridOverlay } from '@/components/chrome/GridOverlay';
import { PrintDefs } from '@/components/chrome/marks/PrintDefs';
import { personJsonLd, siteDescription, siteName, siteTitle, siteUrl } from '@/lib/site';
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
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: { canonical: '/' },
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  openGraph: {
    type: 'profile',
    title: siteTitle,
    description: siteDescription,
    url: '/',
    siteName,
    locale: 'en_PH',
  },
  twitter: { card: 'summary_large_image', title: siteTitle, description: siteDescription },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${montreal.variable} ${montrealText.variable} ${eiko.variable}`}>
      <body>
        {/* First thing in the tab order, and the only thing that moves the
            page for you. Off-screen until it has focus. */}
        <a href="#about" className="skip-link type-meta">
          Skip to content
        </a>

        {children}
        <SmoothScroll />
        <PageIndex />
        <Cursor />
        <Grain />
        <PrintDefs />
        {process.env.NODE_ENV === 'development' && <GridOverlay />}

        <script
          type="application/ld+json"
          // Structured data is markup, not content: it is the one place a
          // string has to reach the document verbatim.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
