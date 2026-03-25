import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "@constants/navigation";
import { useTheme } from "@context/ThemeContext";
import Button from "@components/ui/Button";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
      <div className="relative w-8 h-8 sm:w-9 sm:h-9">
        <div className="absolute inset-0 rounded-full bg-[#e85d04] opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm" />
        <div className="relative w-full h-full rounded-full border-2 border-[#e85d04] flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" fill="#e85d04" />
            <path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.22 4.22l2.12 2.12M13.66 13.66l2.12 2.12M4.22 15.78l2.12-2.12M13.66 6.34l2.12-2.12" stroke="#e85d04" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <span className="font-display text-lg sm:text-xl font-800 tracking-wider text-fg">REVOLVER</span>
    </Link>
  );
}

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    closeMenu();
    if (href.startsWith("/")) {
      navigate(href);
    } else if (pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate({ pathname: "/", hash: href });
    }
  };

  const isKa    = i18n.language === "ka";
  const isLight = theme === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMenu  = () => setMobileOpen(false);
  const switchLang = (lang) => { i18n.changeLanguage(lang); closeMenu(); };

  return (
    <>
      {/* ── Top bar ────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 backdrop-blur-xl border-b border-fg-5" : "py-5 bg-transparent"
        }`}
        style={scrolled ? { backgroundColor: "color-mix(in srgb, var(--bg) 92%, transparent)" } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className={`transition-opacity duration-300 ${mobileOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <Logo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-display text-sm font-medium text-fg-60 hover:text-fg transition-colors duration-200 tracking-wide relative group"
              >
                {t(`nav.${link.key}`)}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#e85d04] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center glass rounded-full px-1 py-1 gap-0.5">
              {["en", "ka"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLang(lang)}
                  className={`font-display text-xs font-700 px-2.5 py-1 rounded-full transition-all duration-200 uppercase ${
                    i18n.language === lang ? "bg-[#e85d04] text-white" : "text-fg-50 hover:text-fg"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 glass rounded-xl flex items-center justify-center text-fg-50 hover:text-[#e85d04] transition-colors duration-200"
            >
              {isLight ? <MoonIcon /> : <SunIcon />}
            </button>
            <Button href="#contact" size="sm">{t("nav.cta")}</Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="md:hidden w-9 h-9 glass rounded-xl flex flex-col justify-center items-center gap-[5px]"
          >
            <span className="block w-4 h-[1.5px] bg-fg rounded-full" />
            <span className="block w-5 h-[1.5px] bg-fg rounded-full" />
            <span className="block w-3 h-[1.5px] bg-[#e85d04] rounded-full" />
          </button>
        </div>
      </motion.header>

      {/* ── Mobile sidebar ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[51] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              className="fixed top-0 right-0 bottom-0 z-[52] w-[300px] flex flex-col overflow-hidden"
              style={{ backgroundColor: "var(--bg)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {/* Left orange accent line */}
              <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#e85d04] to-transparent opacity-60" />

              {/* Top: logo + close */}
              <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-fg-5">
                <button onClick={closeMenu} className="flex items-center gap-2.5 cursor-pointer">
                  <div className="w-8 h-8 rounded-full border-2 border-[#e85d04] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="3" fill="#e85d04" />
                      <path d="M10 2v3M10 15v3M2 10h3M15 10h3" stroke="#e85d04" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="font-display text-base font-800 tracking-wider text-fg">REVOLVER</span>
                </button>
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center text-fg-50 hover:text-[#e85d04] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-5 py-6 space-y-1 overflow-y-auto">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#e85d04]/8 transition-colors duration-200"
                  >
                    <span className="font-display text-[11px] font-700 text-[#e85d04] w-5 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base font-600 text-fg-70 group-hover:text-fg transition-colors duration-200 tracking-wide">
                      {t(`nav.${link.key}`)}
                    </span>
                    <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#e85d04]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                ))}
              </nav>

              {/* Bottom controls */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35 }}
                className="px-5 pb-6 pt-4 border-t border-fg-5 space-y-3"
              >
                {/* Lang + Theme row */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center glass rounded-full px-1 py-1 gap-0.5 flex-1">
                    {["en", "ka"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => switchLang(lang)}
                        className={`flex-1 font-display text-xs font-700 py-1.5 rounded-full transition-all duration-200 uppercase ${
                          i18n.language === lang ? "bg-[#e85d04] text-white" : "text-fg-50 hover:text-fg"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="w-9 h-9 glass rounded-xl flex items-center justify-center text-fg-50 hover:text-[#e85d04] transition-colors"
                  >
                    {isLight ? <MoonIcon /> : <SunIcon />}
                  </button>
                </div>

                {/* CTA */}
                <Button href="#contact" onClick={closeMenu} size="md" className="w-full">
                  {t("nav.cta")}
                </Button>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
