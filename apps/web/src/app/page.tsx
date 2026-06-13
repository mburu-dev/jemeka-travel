import { Metadata } from "next";
import { trpcServer } from "@/lib/trpc";
import { AppLayout as Layout } from "@/components/AppLayout";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Jemeka Tours | Unforgettable African Journeys",
  description: "Experience the raw magic of Africa with expertly crafted safaris, cultural immersions and beach escapes tailored to you.",
  openGraph: {
    title: "Jemeka Tours | Unforgettable African Journeys",
    description: "Experience the raw magic of Africa with expertly crafted safaris, cultural immersions and beach escapes tailored to you.",
    images: ["/images/hero-slides/hero-slide-01-desktop.webp"],
  },
};

export default async function Home() {
  const [destinations, packages] = await Promise.all([
    trpcServer.destination.featured.query(),
    trpcServer.package.featured.query(),
  ]);

  return (
    <Layout>
      {/* Preload critical hero slides for LCP optimization */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-slides/hero-slide-01-desktop.webp"
        media="(min-width: 1281px)"
      />
      <link
        rel="preload"
        as="image"
        href="/images/hero-slides/hero-slide-01-tablet.webp"
        media="(min-width: 769px) and (max-width: 1280px)"
      />
      <link
        rel="preload"
        as="image"
        href="/images/hero-slides/hero-slide-01-mobile.webp"
        media="(max-width: 768px)"
      />
      <link
        rel="preload"
        as="image"
        href="/images/hero-slides/hero-slide-02-desktop.webp"
        media="(min-width: 1281px)"
      />
      <HomeClient 
        destinations={destinations || []} 
        packages={packages || []} 
      />
    </Layout>
  );
}
