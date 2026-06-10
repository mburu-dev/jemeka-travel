import { createRouter, publicQuery, authedQuery } from "./middleware";

export const authRouter = createRouter({
  getSession: authedQuery.query(({ ctx }) => {
    return {
      user: ctx.user,
    };
  }),
  ping: publicQuery.query(() => ({ ok: true })),
});
