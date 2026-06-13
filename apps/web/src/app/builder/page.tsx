import { Metadata } from "next";
import { AppLayout as Layout } from "@/components/AppLayout";
import BuilderClient from "./BuilderClient";

export const metadata: Metadata = {
  title: "Package Builder | Jemeka Tours",
  description: "Build your custom safari package by selecting the destinations you want to visit.",
};

export default function BuilderPage() {
  return (
    <Layout>
      <BuilderClient />
    </Layout>
  );
}
