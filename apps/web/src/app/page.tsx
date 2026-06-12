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
    images: ["/hero-home.jpg"],
  },
};

export default async function Home() {
  const [destinations, packages] = await Promise.all([
    trpcServer.destination.featured.query(),
    trpcServer.package.featured.query(),
  ]);

  return (
    <Layout>
      <HomeClient 
        destinations={destinations || []} 
        packages={packages || []} 
      />
    </Layout>
  );
}
