import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/subscription/', '/api/'],
    },
    sitemap: 'https://aidevix.uz/sitemap.xml',
  };
}
