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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
];

function FeatureCard({ icon, title, desc, index }) {
  const { ref, isInView } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE_OUT_EXPO }}
      className="glass rounded-2xl p-6 group hover:border-[#e85d04]/30 transition-all duration-300"
    >
      <div className="w-11 h-11 rounded-xl bg-[#e85d04]/10 flex items-center justify-center text-[#e85d04] mb-4 group-hover:bg-[#e85d04]/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-display text-base font-700 text-fg mb-2">{title}</h3>
      <p className="text-fg-50 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function SocialMedia() {
  const { t } = useTranslation();
  const heroRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const processRef = useScrollReveal();

  const stats    = t("social_media_page.stats", { returnObjects: true });
  const features = t("social_media_page.features", { returnObjects: true });
  const process  = t("social_media_page.process", { returnObjects: true });

  const FEATURES = FEATURE_ICONS.map((icon, i) => ({ icon, ...features[i] }));

  return (
    <PageLayout>
      <PageHero
        label={t("social_media_page.hero_label")}
        title={t("social_media_page.hero_title")}
        titleAccent={t("social_media_page.hero_title_accent")}
        subtitle={t("social_media_page.hero_subtitle")}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="#contact" size="lg">{t("social_media_page.hero_cta")}</Button>
          <Link to="/pricing" className="font-display text-sm font-600 text-fg-50 hover:text-fg transition-colors duration-200 flex items-center gap-2">
            {t("social_media_page.hero_link")}
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
            ref={heroRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={heroRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("social_media_page.features_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("social_media_page.features_title")} <span className="text-gradient">{t("social_media_page.features_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={processRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={processRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("social_media_page.process_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("social_media_page.process_title")} <span className="text-gradient">{t("social_media_page.process_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {process.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={processRef.isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6 flex gap-5"
              >
                <span className="font-display text-3xl font-800 text-[#e85d04]/30 flex-shrink-0 leading-none">{step.num}</span>
                <div>
                  <h3 className="font-display text-base font-700 text-fg mb-1.5">{step.title}</h3>
                  <p className="text-fg-50 text-sm leading-relaxed">{step.desc}</p>
                </div>
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
              {t("social_media_page.cta_title")} <span className="text-gradient">{t("social_media_page.cta_title_accent")}</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8">
              {t("social_media_page.cta_subtitle")}
            </p>
            <Button href="/#contact" size="lg">{t("social_media_page.cta_button")}</Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
