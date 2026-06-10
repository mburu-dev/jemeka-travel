import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@jemeka/api";

export const trpc = createTRPCReact<AppRouter>();
