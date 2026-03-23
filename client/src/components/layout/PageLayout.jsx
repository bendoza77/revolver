import Header from "./Header";
import Footer from "./Footer";
import CursorGlow from "@components/ui/CursorGlow";

/**
 * Wraps page content with the global shell:
 * CursorGlow overlay, sticky Header, <main>, and Footer.
 */
export default function PageLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-bg">
      <CursorGlow />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
