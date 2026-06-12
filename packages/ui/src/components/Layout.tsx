import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  searchBar?: ReactNode;
}

export function Layout({ children, hideFooter = false, searchBar }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar searchBar={searchBar} />
      <main className="flex-1 pt-0">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
