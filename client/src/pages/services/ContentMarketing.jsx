import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import Button from "@components/ui/Button";
import SectionLabel from "@components/ui/SectionLabel";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { EASE_OUT_EXPO } from "@utils/animations";

const FEATURE_ICONS = [
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
      <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
      <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
      <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/>
      <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
      <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/>
      <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
];

export default function ContentMarketing() {
  const { t } = useTranslation();
  const statsRef = useScrollReveal();
  const featRef  = useScrollReveal();
  const delRef   = useScrollReveal();

  const stats        = t("content_page.stats", { returnObjects: true });
  const featuresText = t("content_page.features", { returnObjects: true });
  const deliverables = t("content_page.deliverables", { returnObjects: true });

  const FEATURES = FEATURE_ICONS.map((icon, i) => ({ icon, ...featuresText[i] }));

  return (
    <PageLayout>
      <PageHero
        label={t("content_page.hero_label")}
        title={t("content_page.hero_title")}
        titleAccent={t("content_page.hero_title_accent")}
        subtitle={t("content_page.hero_subtitle")}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/#contact" size="lg">{t("content_page.hero_cta")}</Button>
          <Link to="/pricing" className="font-display text-sm font-600 text-fg-50 hover:text-fg transition-colors duration-200 flex items-center gap-2">
            {t("content_page.hero_link")}
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

      {/* Features */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={featRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={featRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("content_page.features_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("content_page.features_title")} <span className="text-gradient">{t("content_page.features_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                animate={featRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6 group hover:border-[#e85d04]/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#e85d04]/10 flex items-center justify-center text-[#e85d04] mb-4 group-hover:bg-[#e85d04]/20 transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-display text-base font-700 text-fg mb-2">{f.title}</h3>
                <p className="text-fg-50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section-padding bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={delRef.ref}
              initial={{ opacity: 0, x: -40 }}
              animate={delRef.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              <SectionLabel>{t("content_page.deliverables_label")}</SectionLabel>
              <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-800 text-fg mt-4 mb-6">
                {t("content_page.deliverables_title")} <span className="text-gradient">{t("content_page.deliverables_title_accent")}</span>
              </h2>
              <p className="text-fg-50 text-base leading-relaxed mb-8">
                {t("content_page.deliverables_p")}
              </p>
              <Button href="/#contact" size="md">{t("content_page.deliverables_cta")}</Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={delRef.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {deliverables.map((d, i) => (
                <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-[#e85d04]/20 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-fg-70 text-sm font-500">{d}</span>
                </div>
              ))}
            </motion.div>
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
              {t("content_page.cta_title")} <span className="text-gradient">{t("content_page.cta_title_accent")}</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8">
              {t("content_page.cta_subtitle")}
            </p>
            <Button href="/#contact" size="lg">{t("content_page.cta_button")}</Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
