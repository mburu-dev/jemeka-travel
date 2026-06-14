import { Layout } from "@jemeka/ui/components/Layout";
import { SearchBar } from "./SearchBar";
import { StickyCTA } from "./StickyCTA";
import { auth } from "../auth";

export async function AppLayout({ children, hideFooter }: { children: React.ReactNode, hideFooter?: boolean }) {
  // Wrap auth() in try/catch: missing/invalid OAuth credentials (e.g. empty
  // AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET) cause NextAuth to throw during
  // provider-list construction, crashing every Server Component render.
  // Falling back to null lets the page render as signed-out instead of 500.
  let session = null;
  try {
    session = await auth();
  } catch {
    // Auth provider misconfiguration or runtime error — render as signed-out.
  }

  return (
    <Layout hideFooter={hideFooter} searchBar={<SearchBar />} user={session?.user || null}>
      {children}
      <StickyCTA />
    </Layout>
  );
}
