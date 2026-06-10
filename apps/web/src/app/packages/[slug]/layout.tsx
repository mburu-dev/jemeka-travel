import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  // In a real app, you would fetch the package details from the API here
  const capitalizedSlug = resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${capitalizedSlug} Package`,
    description: `Book the ${capitalizedSlug} package with Jemeka Tours and experience the adventure of a lifetime.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
