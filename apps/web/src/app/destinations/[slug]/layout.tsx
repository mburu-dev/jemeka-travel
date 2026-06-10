import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  // In a real app, you would fetch the destination name from the API here
  const capitalizedSlug = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  return {
    title: `${capitalizedSlug} Safaris & Tours`,
    description: `Explore the best tours and packages in ${capitalizedSlug} with Jemeka Tours.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
