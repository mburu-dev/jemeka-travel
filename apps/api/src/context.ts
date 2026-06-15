import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@jemeka/db";
import { getDb } from "@jemeka/db";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  db?: ReturnType<typeof getDb>;
};

export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<TrpcContext> {
  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
}
