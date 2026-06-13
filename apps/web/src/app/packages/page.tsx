import { Metadata } from "next";
import Image from 'next/image';
import { Suspense } from "react";

import { trpcServer } from "@/lib/trpc";
import { AppLayout as Layout } from "@/components/AppLayout";
import PackagesFilter from "./PackagesFilter";
import PackagesList from "./PackagesList";

export const metadata: Metadata = {
  title: "Tour Packages | Jemeka Tours",
  description: "Explore our curated tour packages. From luxury safaris to beach retreats, find the perfect itinerary for your African adventure.",
};

// Cache this page for 1 hour — reduces DB load on Oracle Free Tier
export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
  }>;
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const [packages, categories] = await Promise.all([
    trpcServer.package.list.query({
      category: params.category,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    }),
    trpcServer.package.categories.query(),
  ]);

  const filteredPackages = packages?.filter((pkg: any) => {
    if (params.q) {
      const s = params.q.toLowerCase();
      return (
        pkg.title.toLowerCase().includes(s) ||
        pkg.shortDescription?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#264653]">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/packages-hero.jpg"
            alt="Our Tour Packages"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)'  }}
          >
            Tour Packages
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Handcrafted itineraries for unforgettable adventures across Africa
            and beyond.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Suspense fallback={<div className="h-10 w-full animate-pulse bg-gray-100 rounded-lg" />}>
            <PackagesFilter categories={categories || []} />
          </Suspense>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PackagesList packages={filteredPackages || []} />
          
          {filteredPackages?.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-900">No packages found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
