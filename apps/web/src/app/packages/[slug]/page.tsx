import { Metadata } from "next";
import Link from 'next/link';
import { notFound } from "next/navigation";

import { trpcServer } from "@/lib/trpc";
import { AppLayout as Layout } from "@/components/AppLayout";
import { Button } from "@jemeka/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PackageDetailClient from "./PackageDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const pkg = await trpcServer.package.getBySlug.query({ slug });
    
    if (!pkg) {
      return {
        title: "Package Not Found | Jemeka Tours",
      };
    }

    return {
      title: `${pkg.title} | Tour Packages | Jemeka Tours`,
      description: pkg.shortDescription || pkg.description.substring(0, 160),
      openGraph: {
        title: `${pkg.title} | Jemeka Tours`,
        description: pkg.shortDescription || pkg.description.substring(0, 160),
        images: pkg.image ? [{ url: pkg.image }] : [],
      },
    };
  } catch (error) {
    return {
      title: "Tour Packages | Jemeka Tours",
    };
  }
}

export default async function PackageDetail({ params }: PageProps) {
  const { slug } = await params;
  
  let pkg;
  try {
    pkg = await trpcServer.package.getBySlug.query({ slug });
  } catch (error) {
    console.error("Error fetching package:", error);
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#264653] mb-4">
              Error loading package
            </h1>
            <Link href="/packages">
              <Button className="bg-[#0F4C75]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!pkg) {
    notFound();
  }

  return (
    <Layout>
      <PackageDetailClient pkg={pkg} />
    </Layout>
  );
}
