import { Layout } from "@jemeka/ui/components/Layout";
import { SearchBar } from "./SearchBar";
import { StickyCTA } from "./StickyCTA";
import { auth } from "../auth";

export async function AppLayout({ children, hideFooter }: { children: React.ReactNode, hideFooter?: boolean }) {
  const session = await auth();
  
  return (
    <Layout hideFooter={hideFooter} searchBar={<SearchBar />} user={session?.user || null}>
      {children}
      <StickyCTA />
    </Layout>
  );
}
