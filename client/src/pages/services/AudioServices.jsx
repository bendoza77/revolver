import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import Button from "@components/ui/Button";
import SectionLabel from "@components/ui/SectionLabel";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { EASE_OUT_EXPO } from "@utils/animations";

const SERVICE_ICONS = [
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
    </svg>
  ),
];

export default function AudioServices() {
  const { t } = useTranslation();
  const statsRef = useScrollReveal();
  const servRef  = useScrollReveal();
  const whyRef   = useScrollReveal();

  const stats    = t("audio_page.stats", { returnObjects: true });
  const servText = t("audio_page.services", { returnObjects: true });
  const why      = t("audio_page.why", { returnObjects: true });

  const SERVICES = SERVICE_ICONS.map((icon, i) => ({ icon, ...servText[i] }));

  return (
    <PageLayout>
      <PageHero
        label={t("audio_page.hero_label")}
        title={t("audio_page.hero_title")}
        titleAccent={t("audio_page.hero_title_accent")}
        subtitle={t("audio_page.hero_subtitle")}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/#contact" size="lg">{t("audio_page.hero_cta")}</Button>
          <Link to="/pricing" className="font-display text-sm font-600 text-fg-50 hover:text-fg transition-colors duration-200 flex items-center gap-2">
            {t("audio_page.hero_link")}
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

      {/* Services */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={servRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={servRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("audio_page.services_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("audio_page.services_title")} <span className="text-gradient">{t("audio_page.services_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                animate={servRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-7 group hover:border-[#e85d04]/30 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#e85d04]/10 flex items-center justify-center text-[#e85d04] flex-shrink-0 group-hover:bg-[#e85d04]/20 transition-colors duration-300">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-display text-base font-700 text-fg">{s.title}</h3>
                      <span className="text-[10px] font-600 font-display uppercase tracking-wider bg-[#e85d04]/15 text-[#e85d04] px-2 py-0.5 rounded-full">
                        {s.highlight}
                      </span>
                    </div>
                    <p className="text-fg-50 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why audio matters */}
      <section className="section-padding bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={whyRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={whyRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12"
          >
            <SectionLabel>{t("audio_page.why_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("audio_page.why_title")} <span className="text-gradient">{t("audio_page.why_title_accent")}</span> {t("audio_page.why_title_end")}
            </h2>
          </motion.div>
          <div className="space-y-5">
            {why.map((w, i) => (
              <motion.div
                key={w.num}
                initial={{ opacity: 0, x: -30 }}
                animate={whyRef.isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6 flex gap-6 items-start"
              >
                <span className="font-display text-3xl font-800 text-[#e85d04]/25 flex-shrink-0 leading-none w-10">{w.num}</span>
                <div>
                  <h3 className="font-display text-base font-700 text-fg mb-1.5">{w.title}</h3>
                  <p className="text-fg-50 text-sm leading-relaxed">{w.desc}</p>
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
              {t("audio_page.cta_title")} <span className="text-gradient">{t("audio_page.cta_title_accent")}</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8">
              {t("audio_page.cta_subtitle")}
            </p>
            <Button href="/#contact" size="lg">{t("audio_page.cta_button")}</Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
