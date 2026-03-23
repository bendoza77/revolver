import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import Button from "@components/ui/Button";
import SectionLabel from "@components/ui/SectionLabel";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { EASE_OUT_EXPO } from "@utils/animations";

const VALUE_ICONS = [
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
];

const TEAM_INITIALS = ["AR", "SM", "LF", "NK"];

export default function AboutUs() {
  const { t } = useTranslation();
  const statsRef  = useScrollReveal();
  const valuesRef = useScrollReveal();
  const teamRef   = useScrollReveal();
  const missionRef = useScrollReveal();

  const stats        = t("about.stats", { returnObjects: true });
  const missionPoints = t("about.mission_points", { returnObjects: true });
  const valuesText   = t("about.values", { returnObjects: true });
  const teamText     = t("about.team", { returnObjects: true });

  const VALUES = VALUE_ICONS.map((icon, i) => ({ icon, ...valuesText[i] }));
  const TEAM   = TEAM_INITIALS.map((initials, i) => ({ initials, ...teamText[i] }));

  return (
    <PageLayout>
      <PageHero
        label={t("about.hero_label")}
        title={t("about.hero_title")}
        titleAccent={t("about.hero_title_accent")}
        subtitle={t("about.hero_subtitle")}
      />

      {/* Stats bar */}
      <section className="py-12 sm:py-16 border-y border-fg-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                ref={statsRef.ref}
                initial={{ opacity: 0, y: 24 }}
                animate={statsRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="text-center"
              >
                <div className="font-display text-[clamp(2rem,5vw,3.5rem)] font-800 text-gradient mb-1">{s.value}</div>
                <div className="text-fg-40 text-xs sm:text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={missionRef.ref}
              initial={{ opacity: 0, x: -40 }}
              animate={missionRef.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              <SectionLabel>{t("about.mission_label")}</SectionLabel>
              <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] font-800 text-fg mt-4 mb-6">
                {t("about.mission_title")} <span className="text-gradient">{t("about.mission_title_accent")}</span>
              </h2>
              <p className="text-fg-50 text-base leading-relaxed mb-5">
                {t("about.mission_p1")}
              </p>
              <p className="text-fg-50 text-base leading-relaxed">
                {t("about.mission_p2")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={missionRef.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT_EXPO }}
              className="glass rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 80% 20%, rgba(232,93,4,0.08) 0%, transparent 60%)" }} />
              <div className="relative z-10 space-y-5">
                {missionPoints.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={missionRef.isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE_OUT_EXPO }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#e85d04]/20 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span className="text-fg-70 text-sm font-500">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={valuesRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={valuesRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("about.values_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("about.values_title")} <span className="text-gradient">{t("about.values_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                animate={valuesRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-7 flex gap-5 group hover:border-[#e85d04]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e85d04]/10 flex items-center justify-center text-[#e85d04] flex-shrink-0 group-hover:bg-[#e85d04]/20 transition-colors duration-300">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-display text-base font-700 text-fg mb-2">{v.title}</h3>
                  <p className="text-fg-50 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={teamRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={teamRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>{t("about.team_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] font-800 text-fg mt-4">
              {t("about.team_title")} <span className="text-gradient">{t("about.team_title_accent")}</span> {t("about.team_title_end")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                animate={teamRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6 text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#e85d04]/15 border border-[#e85d04]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#e85d04]/25 transition-colors duration-300">
                  <span className="font-display text-lg font-800 text-[#e85d04]">{member.initials}</span>
                </div>
                <h3 className="font-display text-base font-700 text-fg mb-1">{member.name}</h3>
                <p className="text-[#e85d04] text-xs font-600 font-display uppercase tracking-wider mb-3">{member.role}</p>
                <p className="text-fg-40 text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-800 text-fg mb-4">
              {t("about.cta_title")} <span className="text-gradient">{t("about.cta_title_accent")}</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8">
              {t("about.cta_subtitle")}
            </p>
            <Button href="/#contact" size="lg">{t("about.cta_button")}</Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
