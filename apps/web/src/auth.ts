import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@jemeka/db";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { render } from "@react-email/components";
import MagicLinkEmail from "./emails/MagicLinkEmail";
import React from "react";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(getDb()),
  providers: [
    Google,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "Jemeka Tours <onboarding@resend.dev>", // Replace with your domain in production
      async sendVerificationRequest({ identifier, url, provider }) {
        const resend = (provider as any).resend;
        
        const html = await render(React.createElement(MagicLinkEmail, { url }));
        
        const result = await resend.emails.send({
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
