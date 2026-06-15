import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TRPCReactProvider } from "../providers/trpc-provider";

const inter = localFont({
  src: "../../public/fonts/inter.woff2",
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const outfit = localFont({
  src: "../../public/fonts/outfit.woff2",
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jemekatoursandtravel.com"),
  title: {
    template: "%s | Jemeka Tours and Travel",
    default: "Jemeka Tours and Travel - Unforgettable African Safaris",
  },
  description: "Discover the magic of East Africa with Jemeka Tours. Book exclusive safaris, cultural tours, and beach holidays in Kenya, Tanzania, and beyond.",
  openGraph: {
    title: "Jemeka Tours and Travel",
    description: "Discover the magic of East Africa with Jemeka Tours.",
    url: "https://jemekatoursandtravel.com",
    siteName: "Jemeka Tours and Travel",
    locale: "en_US",
    type: "website",
  },
};

import { CSPostHogProvider } from "../providers/posthog-provider";
import { ThemeProvider } from "../providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground" suppressHydrationWarning>
        {/* Skip navigation — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#0F4C75] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CSPostHogProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </CSPostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
