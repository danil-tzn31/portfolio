import { contact, profile } from '@/data/profile';

/**
 * Where the site lives. Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every
 * deploy, so the canonical URL and the sitemap are right from the first push.
 * NEXT_PUBLIC_SITE_URL overrides it if a custom domain lands.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const siteName = profile.name.join(' ');

export const siteTitle = `${siteName} — Junior developer`;

export const siteDescription =
  'Computer Engineering graduate from De La Salle University–Dasmariñas. ' +
  'Websites and small machine-learning projects, designed and built end to end.';

/**
 * Structured data, so a search result is a person rather than a URL. Every
 * field is also stated on the page itself.
 */
export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteName,
  url: siteUrl,
  email: `mailto:${contact.email}`,
  jobTitle: 'Junior developer',
  description: siteDescription,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'De La Salle University – Dasmariñas',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dasmariñas',
    addressRegion: 'Cavite',
    addressCountry: 'PH',
  },
  knowsAbout: [
    'Web development',
    'Front-end development',
    'TypeScript',
    'React',
    'Next.js',
    'Python',
    'Machine learning',
    'IT service desk',
  ],
  sameAs: contact.channels.flatMap((channel) => (channel.href ? [channel.href] : [])),
};
