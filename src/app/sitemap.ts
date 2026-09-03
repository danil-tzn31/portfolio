import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

// One page, and saying so is the whole job.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
