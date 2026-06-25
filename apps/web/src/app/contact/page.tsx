import { Metadata } from "next";
import { AppLayout as Layout } from "@/components/AppLayout";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Jemeka Tours & Travel",
  description: "Get in touch with Jemeka Tours & Travel for booking enquiries, tour information, or customer support. We're here to help you plan your perfect African adventure.",
};

export default function Contact() {
  return (
    <Layout>
      <ContactClient />
    </Layout>
  );
}
