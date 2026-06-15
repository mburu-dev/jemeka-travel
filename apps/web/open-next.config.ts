import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Use dummy (no-op) overrides for cache / queue / tag-cache because this app
// does not use ISR or distributed caching. This keeps the Worker bundle small
// and avoids unnecessary KV / Durable Object bindings.
export default defineCloudflareConfig({
  // @ts-expect-error - OpenNext v4 types might not match this structure, but the build script relies on it
  overrides: {
    incrementalCache: "dummy",
    tagCache: "dummy",
    queue: "dummy",
  },
});
