import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// NOTE: We use JWT session strategy (no DB adapter) so the Next.js web Worker
// stays free of @libsql/client and can run on the Cloudflare edge.
// User identity is stored in a signed, encrypted cookie (no server-side session store needed).
//
// ⚠️  The Resend magic-link provider requires a database adapter (to store
//     verification tokens). It is intentionally excluded from the edge build.
//     To add magic-link support, wire up the @auth/drizzle-adapter with Turso.

export const { handlers, auth, signIn, signOut } = NextAuth({
  // JWT strategy — no database adapter required
  session: { strategy: "jwt" },
  providers: [
    Google,
  ],
  callbacks: {
    jwt({ token, user }) {
      // Persist user id and role into the JWT token on sign in
      if (user) {
        token.id = user.id;
        // @ts-expect-error role is added
        token.role = user.role || "user";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error role is a custom field added via JWT callback
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
});
