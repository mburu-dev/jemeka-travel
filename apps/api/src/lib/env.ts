import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  databaseAuthToken: process.env.DATABASE_AUTH_TOKEN ?? "",
  authSecret: process.env.AUTH_SECRET ?? "",
  frontendUrl: required("FRONTEND_URL"),
  resendApiKey: process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY ?? "",
  posthogApiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? process.env.POSTHOG_API_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? process.env.POSTHOG_HOST ?? "https://us.i.posthog.com",
};
