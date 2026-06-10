"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import React, { useState } from "react";
import { trpc } from "./trpc";
import { SessionProvider } from "next-auth/react";

function getBaseUrl() {
  // Server-side render: use the internal API url
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  }
  // Browser: use env variable or default
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          async headers() {
            return {
              "x-trpc-source": "nextjs-react",
            };
          },
          // Add this to include cookies in cross-origin requests
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <SessionProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
}
