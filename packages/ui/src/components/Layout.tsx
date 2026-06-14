import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  searchBar?: ReactNode;
  user?: any;
}

export function Layout({ children, hideFooter = false, searchBar, user }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar searchBar={searchBar} user={user} />
      <main id="main-content" className="flex-1 pt-0" tabIndex={-1}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
