import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import Button from "@components/ui/Button";
import SectionLabel from "@components/ui/SectionLabel";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { EASE_OUT_EXPO } from "@utils/animations";

const PLATFORM_COLORS = ["#1877F2", "#4285F4", "#FF0000", "#010101"];
const PLATFORM_ICONS = [
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.8 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z"/>
    </svg>
  ),
];

export default function DigitalAds() {
  const { t } = useTranslation();
  const statsRef   = useScrollReveal();
  const platRef    = useScrollReveal();
  const featRef    = useScrollReveal();

  const stats    = t("ads_page.stats", { returnObjects: true });
  const platText = t("ads_page.platforms", { returnObjects: true });
  const features = t("ads_page.features", { returnObjects: true });

  const PLATFORMS = PLATFORM_ICONS.map((icon, i) => ({
    icon,
    color: PLATFORM_COLORS[i],
    ...platText[i],
  }));

  return (
    <PageLayout>
      <PageHero
        label={t("ads_page.hero_label")}
        title={t("ads_page.hero_title")}
        titleAccent={t("ads_page.hero_title_accent")}
        subtitle={t("ads_page.hero_subtitle")}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/#contact" size="lg">{t("ads_page.hero_cta")}</Button>
          <Link to="/pricing" className="font-display text-sm font-600 text-fg-50 hover:text-fg transition-colors duration-200 flex items-center gap-2">
            {t("ads_page.hero_link")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </PageHero>

      {/* Stats */}
      <section className="py-12 sm:py-16 border-y border-fg-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                ref={statsRef.ref}
                initial={{ opacity: 0, y: 24 }}
                animate={statsRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_OUT_EXPO }}
                className="text-center"
              >
                <div className="font-display text-[clamp(1.8rem,5vw,3rem)] font-800 text-gradient mb-1">{s.value}</div>
                <div className="text-fg-40 text-xs sm:text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={platRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={platRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("ads_page.platforms_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("ads_page.platforms_title")} <span className="text-gradient">{t("ads_page.platforms_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 40 }}
                animate={platRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6 flex gap-5 group hover:border-[#e85d04]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e85d04]/10 flex items-center justify-center text-[#e85d04] flex-shrink-0 group-hover:bg-[#e85d04]/20 transition-colors duration-300">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-display text-base font-700 text-fg mb-1.5">{p.name}</h3>
                  <p className="text-fg-50 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={featRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={featRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("ads_page.features_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("ads_page.features_title")} <span className="text-gradient">{t("ads_page.features_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                animate={featRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6"
              >
                <div className="w-2 h-2 rounded-full bg-[#e85d04] mb-4" />
                <h3 className="font-display text-base font-700 text-fg mb-2">{f.title}</h3>
                <p className="text-fg-50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-800 text-fg mb-4">
              {t("ads_page.cta_title")} <span className="text-gradient">{t("ads_page.cta_title_accent")}</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8">
              {t("ads_page.cta_subtitle")}
            </p>
            <Button href="/#contact" size="lg">{t("ads_page.cta_button")}</Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
