import { Metadata } from "next";
import Link from 'next/link';
import { notFound } from "next/navigation";

import { trpcServer } from "@/lib/trpc";
import { AppLayout as Layout } from "@/components/AppLayout";
import { Button } from "@jemeka/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DestinationDetailClient from "./DestinationDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const destination = await trpcServer.destination.getBySlug.query({ slug });
    
    if (!destination) {
      return {
        title: "Destination Not Found | Jemeka Tours",
      };
    }

    // Generate rich description
    const rawDescription = destination.shortDescription || destination.description;
    const baseDescription = rawDescription.length > 160 ? rawDescription.substring(0, 157) + "..." : rawDescription;
    
    // Gather images
    const images = [];
    if (destination.gallery && destination.gallery.length > 0) {
      images.push(...destination.gallery.map((url: string) => ({ url })));
    } else if (destination.image) {
      images.push({ url: destination.image });
    } else {
      images.push({ url: "/images/destinations/serengeti.jpg" }); // Fallback
    }

    return {
      title: `${destination.name} Safari & Tours | Jemeka Tours`,
      description: baseDescription,
      keywords: `safari, tours, ${destination.name}, ${destination.country}, ${destination.region}, travel, Jemeka Tours, ${destination.highlights?.slice(0, 3).join(', ') || ''}`,
      openGraph: {
        title: `Explore ${destination.name} - Luxury African Travel | Jemeka Tours`,
        description: baseDescription,
        images,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: "Destinations | Jemeka Tours",
    };
  }
}

export default async function DestinationDetail({ params }: PageProps) {
  const { slug } = await params;
  
  let destination;
  try {
    destination = await trpcServer.destination.getBySlug.query({ slug });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#264653] mb-4">
              Error loading destination
            </h1>
            <Link href="/destinations">
              <Button className="bg-[#0F4C75]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Destinations
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!destination) {
    notFound();
  }

  return (
    <Layout>
      <DestinationDetailClient destination={destination} />
    </Layout>
  );
}
