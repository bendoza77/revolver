import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { AppProvider } from "@context/AppContext";
import { ThemeProvider } from "@context/ThemeContext";
import { AuthProvider } from "@context/AuthContext";
import ProtectedRoute from "@components/admin/ProtectedRoute";
import AIChat from "@components/ui/AIChat";
import { useSiteContent } from "@hooks/useSiteContent";

/* ── Lazy-loaded pages (each becomes its own JS chunk) ──────── */
const Home             = lazy(() => import("@pages/Home"));
const ServicesPage     = lazy(() => import("@pages/services/ServicesPage"));
const SocialMedia      = lazy(() => import("@pages/services/SocialMedia"));
const ContentMarketing = lazy(() => import("@pages/services/ContentMarketing"));
const DigitalAds       = lazy(() => import("@pages/services/DigitalAds"));
const AudioServices    = lazy(() => import("@pages/services/AudioServices"));
const AboutUs          = lazy(() => import("@pages/company/AboutUs"));
const OurWork          = lazy(() => import("@pages/company/OurWork"));
const PricingPage      = lazy(() => import("@pages/company/PricingPage"));
const Blog             = lazy(() => import("@pages/company/Blog"));
const BlogPost         = lazy(() => import("@pages/company/BlogPost"));
const Privacy          = lazy(() => import("@pages/legal/Privacy"));
const Terms            = lazy(() => import("@pages/legal/Terms"));
const AdminLogin       = lazy(() => import("@pages/admin/Login"));
const AdminDashboard   = lazy(() => import("@pages/admin/Dashboard"));

/* ── Page titles ────────────────────────────────────────────── */
const PAGE_TITLES = {
  "/":                           "REVOLVER — Creative Agency",
  "/services":                   "Services | REVOLVER",
  "/services/social-media":      "Social Media | REVOLVER",
  "/services/content-marketing": "Content Marketing | REVOLVER",
  "/services/digital-ads":       "Digital Ads | REVOLVER",
  "/services/audio":             "Audio Services | REVOLVER",
  "/about":                      "About Us | REVOLVER",
  "/work":                       "Our Work | REVOLVER",
  "/pricing":                    "Pricing | REVOLVER",
  "/blog":                       "Blog | REVOLVER",
  "/privacy":                    "Privacy Policy | REVOLVER",
  "/terms":                      "Terms of Service | REVOLVER",
};

/* ── Minimal page loader shown while a chunk downloads ─────── */
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#e85d04] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      window.scrollTo(0, 0);
    }
    const postTitle = pathname.startsWith("/blog/") ? "Blog | REVOLVER" : null;
    document.title = postTitle ?? PAGE_TITLES[pathname] ?? "REVOLVER";
  }, [pathname, hash]);
  return null;
}

function SiteContentLoader() {
  useSiteContent();
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <SiteContentLoader />
          <BrowserRouter>
            <ScrollToTop />
            <AIChat />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"                           element={<Home />} />
                <Route path="/services"                   element={<ServicesPage />} />
                <Route path="/services/social-media"      element={<SocialMedia />} />
                <Route path="/services/content-marketing" element={<ContentMarketing />} />
                <Route path="/services/digital-ads"       element={<DigitalAds />} />
                <Route path="/services/audio"             element={<AudioServices />} />
                <Route path="/about"                      element={<AboutUs />} />
                <Route path="/work"                       element={<OurWork />} />
                <Route path="/pricing"                    element={<PricingPage />} />
                <Route path="/blog"                       element={<Blog />} />
                <Route path="/blog/:slug"                 element={<BlogPost />} />
                <Route path="/privacy"                    element={<Privacy />} />
                <Route path="/terms"                      element={<Terms />} />
                <Route path="/revolver-studio/login"      element={<AdminLogin />} />
                <Route path="/revolver-studio"            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
