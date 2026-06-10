import { Metadata } from "next";
import Link from 'next/link';
import { notFound } from "next/navigation";

import { trpcServer } from "@/lib/trpc";
import { Layout } from "@jemeka/ui/components/Layout";
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

    return {
      title: `${destination.name} | Destinations | Jemeka Tours`,
      description: destination.shortDescription || destination.description.substring(0, 160),
      openGraph: {
        title: `${destination.name} | Jemeka Tours`,
        description: destination.shortDescription || destination.description.substring(0, 160),
        images: destination.image ? [{ url: destination.image }] : [],
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
