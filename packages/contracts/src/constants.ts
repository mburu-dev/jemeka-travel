// Session cookie configuration
export const Session = {
  cookieName: "jemeka_session",
  maxAge: 60 * 60 * 24 * 7, // 7 days
} as const;

// API paths
export const Paths = {
  oauthCallback: "/api/auth/callback",
  trpc: "/api/trpc",
} as const;

// Error messages
export const ErrorMessages = {
  unauthenticated: "You must be logged in to access this resource.",
  insufficientRole: "You do not have permission to perform this action.",
  notFound: "The requested resource was not found.",
  badRequest: "Invalid request data.",
} as const;
