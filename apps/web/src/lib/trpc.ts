import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../api/src/index";
import superjson from "superjson";

export const trpcServer = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/trpc",
      transformer: superjson,
    }),
  ],
});
