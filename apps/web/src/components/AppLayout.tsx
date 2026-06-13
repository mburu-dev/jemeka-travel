import { Layout } from "@jemeka/ui/components/Layout";
import { SearchBar } from "./SearchBar";
import { StickyCTA } from "./StickyCTA";

export function AppLayout({ children, hideFooter }: { children: React.ReactNode, hideFooter?: boolean }) {
  return (
    <Layout hideFooter={hideFooter} searchBar={<SearchBar />}>
      {children}
      <StickyCTA />
    </Layout>
  );
}
