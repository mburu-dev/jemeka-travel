import { MetadataRoute } from 'next';
import { trpcServer } from '@/lib/trpc';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jemekatoursandtravel.com';

  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/destinations',
    '/packages',
    '/testimonials',
    '/services',
    '/cookie-policy',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes — wrapped in try/catch so build succeeds even if DB is
  // not reachable (e.g. during CI / static export without live credentials).
  let destinationRoutes: MetadataRoute.Sitemap = [];
  let packageRoutes: MetadataRoute.Sitemap = [];

  try {
    const [destinations, packages] = await Promise.all([
      trpcServer.destination.list.query(),
      trpcServer.package.list.query({}),
    ]);

    destinationRoutes = (destinations || []).map((dest: any) => ({
      url: `${baseUrl}/destinations/${dest.slug}`,
      lastModified: new Date(dest.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    packageRoutes = (packages || []).map((pkg: any) => ({
      url: `${baseUrl}/packages/${pkg.slug}`,
      lastModified: new Date(pkg.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    // During build time, the API may not be reachable — fall back to static routes only.
    console.warn('[sitemap] Could not fetch dynamic routes, using static routes only:', error);
  }

  return [...routes, ...destinationRoutes, ...packageRoutes];
}
