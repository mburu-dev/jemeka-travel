"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
    });
  } else {
    console.warn("PostHog key is missing, analytics and error tracking disabled.");
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This allows identifying errors inside the application gracefully.
    // Window errors and promise rejections are automatically captured by PostHog if configured.
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
