import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider } from "@context/AppContext";
import { ThemeProvider } from "@context/ThemeContext";

const PAGE_TITLES = {
  "/":                          "REVOLVER — Creative Agency",
  "/services":                  "Services | REVOLVER",
  "/services/social-media":     "Social Media | REVOLVER",
  "/services/content-marketing":"Content Marketing | REVOLVER",
  "/services/digital-ads":      "Digital Ads | REVOLVER",
  "/services/audio":            "Audio Services | REVOLVER",
  "/about":                     "About Us | REVOLVER",
  "/work":                      "Our Work | REVOLVER",
  "/pricing":                   "Pricing | REVOLVER",
  "/blog":                      "Blog | REVOLVER",
  "/privacy":                   "Privacy Policy | REVOLVER",
  "/terms":                     "Terms of Service | REVOLVER",
};

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
    const postTitle = pathname.startsWith("/blog/")
      ? "Blog | REVOLVER"
      : null;
    document.title = postTitle ?? PAGE_TITLES[pathname] ?? "REVOLVER";
  }, [pathname, hash]);
  return null;
}

import Home           from "@pages/Home";
import ServicesPage   from "@pages/services/ServicesPage";
import SocialMedia    from "@pages/services/SocialMedia";
import ContentMarketing from "@pages/services/ContentMarketing";
import DigitalAds     from "@pages/services/DigitalAds";
import AudioServices  from "@pages/services/AudioServices";
import AboutUs        from "@pages/company/AboutUs";
import OurWork        from "@pages/company/OurWork";
import PricingPage    from "@pages/company/PricingPage";
import Blog           from "@pages/company/Blog";
import BlogPost       from "@pages/company/BlogPost";
import Privacy        from "@pages/legal/Privacy";
import Terms          from "@pages/legal/Terms";


export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/"                         element={<Home />} />
            <Route path="/services"                 element={<ServicesPage />} />
            <Route path="/services/social-media"    element={<SocialMedia />} />
            <Route path="/services/content-marketing" element={<ContentMarketing />} />
            <Route path="/services/digital-ads"     element={<DigitalAds />} />
            <Route path="/services/audio"           element={<AudioServices />} />
            <Route path="/about"                    element={<AboutUs />} />
            <Route path="/work"                     element={<OurWork />} />
            <Route path="/pricing"                  element={<PricingPage />} />
            <Route path="/blog"                     element={<Blog />} />
            <Route path="/blog/:slug"               element={<BlogPost />} />
            <Route path="/privacy"                  element={<Privacy />} />
            <Route path="/terms"                    element={<Terms />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
