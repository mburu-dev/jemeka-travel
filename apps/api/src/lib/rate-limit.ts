/**
 * Lightweight in-process IP-based rate limiter for Hono.
 * Works on Cloudflare Workers and Node.js — no external dependencies.
 *
 * Each limiter instance maintains a sliding-window counter per IP.
 * Old entries are pruned on every request to prevent unbounded memory growth.
 */

interface Entry {
  count: number;
  resetAt: number; // epoch ms
}

export interface RateLimitOptions {
  /** Max requests allowed within windowMs. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
  /** Optional human-readable message returned in the 429 body. */
  message?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const store = new Map<string, Entry>();
  const { limit, windowMs, message = "Too many requests. Please try again later." } = options;

  return async function rateLimitMiddleware(
    c: { req: { header: (name: string) => string | undefined }; json: (body: unknown, status: number) => Response },
    next: () => Promise<void>
  ) {
    const now = Date.now();

    // Derive client IP from Cloudflare header, then standard proxy headers, then fallback
    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0].trim() ||
      c.req.header("x-real-ip") ||
      "unknown";

    // Prune expired entries to prevent memory leaks
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) store.delete(key);
    }

    const entry = store.get(ip);

    if (!entry || entry.resetAt <= now) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    entry.count += 1;

    if (entry.count > limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return c.json(
        { error: message, retryAfter },
        429
      ) as unknown as void;
    }

    await next();
  };
}

// Pre-built limiters for the two highest-risk endpoints
export const bookingRateLimit = createRateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1000, // 5 per 15 minutes
  message: "Too many booking attempts. Please wait before trying again.",
});

export const enquiryRateLimit = createRateLimiter({
  limit: 10,
  windowMs: 15 * 60 * 1000, // 10 per 15 minutes
  message: "Too many contact form submissions. Please wait before trying again.",
});
