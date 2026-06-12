import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb, users, accounts, sessions, verificationTokens } from "@jemeka/db";
import Google from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import { render } from "@react-email/components";
import MagicLinkEmail from "./emails/MagicLinkEmail";
import React from "react";
import { Resend } from "resend";

const resendClient = new Resend(process.env.AUTH_RESEND_KEY);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google,
    ResendProvider({
      from: "Jemeka Tours <onboarding@resend.dev>", // Replace with your domain in production
      async sendVerificationRequest({ identifier, url, provider }) {
        const html = await render(React.createElement(MagicLinkEmail, { url }));
        
        const result = await resendClient.emails.send({
          from: provider.from,
          to: identifier,
          subject: `Log in to Jemeka Tours`,
          html: html,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-ignore
        session.user.role = user.role || "user";
      }
      return session;
    },
  },
});
