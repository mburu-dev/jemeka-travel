import { Metadata } from "next";
import { AppLayout as Layout } from "@/components/AppLayout";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Our Services | Jemeka Tours & Travel Kenya",
  description: "Explore Jemeka Tours' full range of travel services including Safari Packages, Beach Holidays, Corporate Retreats, Airport Transfers, Visa Assistance, and more.",
};

export default function ServicesPage() {
  return (
    <Layout>
      <ServicesClient />
    </Layout>
  );
}
