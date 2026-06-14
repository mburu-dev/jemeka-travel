import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Use dummy (no-op) overrides for cache / queue / tag-cache because this app
// does not use ISR or distributed caching. This keeps the Worker bundle small
// and avoids unnecessary KV / Durable Object bindings.
export default defineCloudflareConfig({
  overrides: {
    incrementalCache: "dummy",
    tagCache: "dummy",
    queue: "dummy",
  },
});
