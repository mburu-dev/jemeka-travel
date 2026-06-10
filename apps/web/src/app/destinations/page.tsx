import { Metadata } from "next";
import Image from 'next/image';
import { Suspense } from "react";

import { trpcServer } from "@/lib/trpc";
import { Layout } from "@jemeka/ui/components/Layout";
import DestinationsFilter from "./DestinationsFilter";
import DestinationsList from "./DestinationsList";

export const metadata: Metadata = {
  title: "Explore Destinations | Jemeka Tours",
  description: "Discover breathtaking destinations across Africa and beyond. From the Serengeti to Zanzibar, find your next adventure.",
};

interface PageProps {
  searchParams: Promise<{ region?: string }>;
}

export default async function DestinationsPage({ searchParams }: PageProps) {
  const { region } = await searchParams;
  
  const destinations = await trpcServer.destination.list.query(
    region ? { region } : undefined
  );

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#264653]">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/about-hero.jpg"
            alt="Destinations"
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
            Our Destinations
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Explore breathtaking destinations across Africa and beyond, each
            offering unique experiences and unforgettable memories.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Suspense fallback={<div className="h-10 w-full animate-pulse bg-gray-100 rounded-full" />}>
            <DestinationsFilter />
          </Suspense>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DestinationsList destinations={destinations || []} />
          
          {destinations?.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-900">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
