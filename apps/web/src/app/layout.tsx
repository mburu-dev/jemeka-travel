import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "../providers/trpc-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Jemeka Tours and Travel",
    default: "Jemeka Tours and Travel - Unforgettable African Safaris",
  },
  description: "Discover the magic of East Africa with Jemeka Tours. Book exclusive safaris, cultural tours, and beach holidays in Kenya, Tanzania, and beyond.",
  openGraph: {
    title: "Jemeka Tours and Travel",
    description: "Discover the magic of East Africa with Jemeka Tours.",
    url: "https://jemekatours.com",
    siteName: "Jemeka Tours",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
