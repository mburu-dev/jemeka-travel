import { Metadata } from "next";
import { AppLayout as Layout } from "@/components/AppLayout";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Jemeka Tours & Travel",
  description: "Learn about Jemeka Tours & Travel, a leading travel agency in Kenya specializing in safaris, beach holidays, and cultural tours across East Africa and beyond.",
};

export default function About() {
  return (
    <Layout>
      <AboutClient />
    </Layout>
  );
}
