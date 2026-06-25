import { Metadata } from "next";
import { AppLayout as Layout } from "@/components/AppLayout";
import TestimonialsClient from "./TestimonialsClient";

export const metadata: Metadata = {
  title: "Testimonials | Jemeka Tours & Travel",
  description: "Read what our happy customers have to say about their unforgettable travel experiences with Jemeka Tours & Travel.",
};

export default function Testimonials() {
  return (
    <Layout>
      <TestimonialsClient />
    </Layout>
  );
}
