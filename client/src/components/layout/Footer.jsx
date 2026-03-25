import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FOOTER_LINK_KEYS } from "@constants/navigation";
import revolverLogo from "@/assets/revolver.jpg";

const SOCIAL_ICONS = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.8 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

// Map footer item text → route path (EN + KA)
const FOOTER_ROUTES = {
  // English
  "Social Media":       "/services/social-media",
  "Content Marketing":  "/services/content-marketing",
  "Digital Ads":        "/services/digital-ads",
  "Audio Services":     "/services/audio",
  "About Us":           "/about",
  "Our Work":           "/work",
  "Pricing":            "/pricing",
  "Blog":               "/blog",
  // Georgian
  "სოციალური მედია":    "/services/social-media",
  "კონტენტ მარკეტინგი": "/services/content-marketing",
  "ციფრული Ads":        "/services/digital-ads",
  "აუდიო სერვისები":    "/services/audio",
  "ჩვენ შესახებ":       "/about",
  "ჩვენი სამუშაო":      "/work",
  "ფასები":             "/pricing",
  "ბლოგი":              "/blog",
};

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative border-t border-fg-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(232,93,4,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top row */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand block */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={revolverLogo}
                alt="REVOLVER"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#e85d04]"
              />
              <span className="font-display text-xl font-800 tracking-wider text-fg">REVOLVER</span>
            </div>
            <p className="text-fg-40 text-sm leading-relaxed max-w-xs mb-6">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  whileHover={{ y: -2, color: "#e85d04" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-fg-50 transition-colors duration-200"
                  aria-label={s.name}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINK_KEYS.map((key) => {
            const items = t(`footer.${key}.items`, { returnObjects: true });
            return (
              <div key={key}>
                <h4 className="font-display text-xs font-600 tracking-[0.18em] uppercase text-fg-40 mb-5">
                  {t(`footer.${key}.title`)}
                </h4>
                <ul className="space-y-3">
                  {items.map((item) => {
                    const route = FOOTER_ROUTES[item];
                    return (
                      <li key={item}>
                        {route ? (
                          <Link
                            to={route}
                            className="text-fg-55 text-sm hover:text-fg transition-colors duration-200"
                          >
                            {item}
                          </Link>
                        ) : (
                          <span className="text-fg-40 text-sm">{item}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="py-5 sm:py-6 border-t border-fg-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-fg-25 text-xs">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4 sm:gap-5">
            <Link to="/privacy" className="text-fg-25 text-xs hover:text-fg-50 transition-colors duration-200">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms" className="text-fg-25 text-xs hover:text-fg-50 transition-colors duration-200">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
