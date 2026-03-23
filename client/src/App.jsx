import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@context/AppContext";
import { ThemeProvider } from "@context/ThemeContext";

import Home           from "@pages/Home";
import SocialMedia    from "@pages/services/SocialMedia";
import ContentMarketing from "@pages/services/ContentMarketing";
import DigitalAds     from "@pages/services/DigitalAds";
import AudioServices  from "@pages/services/AudioServices";
import AboutUs        from "@pages/company/AboutUs";
import OurWork        from "@pages/company/OurWork";
import PricingPage    from "@pages/company/PricingPage";
import Blog           from "@pages/company/Blog";
import Privacy        from "@pages/legal/Privacy";
import Terms          from "@pages/legal/Terms";


export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"                         element={<Home />} />
            <Route path="/services/social-media"    element={<SocialMedia />} />
            <Route path="/services/content-marketing" element={<ContentMarketing />} />
            <Route path="/services/digital-ads"     element={<DigitalAds />} />
            <Route path="/services/audio"           element={<AudioServices />} />
            <Route path="/about"                    element={<AboutUs />} />
            <Route path="/work"                     element={<OurWork />} />
            <Route path="/pricing"                  element={<PricingPage />} />
            <Route path="/blog"                     element={<Blog />} />
            <Route path="/privacy"                  element={<Privacy />} />
            <Route path="/terms"                    element={<Terms />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
