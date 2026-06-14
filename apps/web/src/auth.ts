import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb, users, accounts, sessions, verificationTokens } from "@jemeka/db";
import Google from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import { render } from "@react-email/components";
import MagicLinkEmail from "./emails/MagicLinkEmail";
import React from "react";
import { Resend } from "resend";

const resendClient = process.env.AUTH_RESEND_KEY 
  ? new Resend(process.env.AUTH_RESEND_KEY) 
  : null;

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
        if (!resendClient) {
          throw new Error("AUTH_RESEND_KEY is not configured.");
        }
        const html = await render(React.createElement(MagicLinkEmail, { url }));
        
        const result = await resendClient.emails.send({
          from: provider.from ?? "Jemeka Tours <onboarding@resend.dev>",
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
        // @ts-expect-error role is added
        session.user.role = user.role || "user";
      }
      return session;
    },
  },
});
