import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jemekatoursandtravel.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login/', '/builder/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
