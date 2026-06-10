import { createRouter, publicQuery } from "./middleware";

export const authRouter = createRouter({
  // Placeholder — auth will be wired up with NextAuth in a future phase
  ping: publicQuery.query(() => ({ authenticated: false })),
});
