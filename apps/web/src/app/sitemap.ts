import { MetadataRoute } from 'next';
import { trpcServer } from '@/lib/trpc';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jemekatours.com';

  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/destinations',
    '/packages',
    '/testimonials',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes
  const [destinations, packages] = await Promise.all([
    trpcServer.destination.list.query(),
    trpcServer.package.list.query({}),
  ]);

  const destinationRoutes = (destinations || []).map((dest: any) => ({
    url: `${baseUrl}/destinations/${dest.slug}`,
    lastModified: new Date(dest.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const packageRoutes = (packages || []).map((pkg: any) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: new Date(pkg.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...destinationRoutes, ...packageRoutes];
}
