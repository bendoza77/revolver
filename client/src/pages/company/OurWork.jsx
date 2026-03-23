import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import Button from "@components/ui/Button";
import SectionLabel from "@components/ui/SectionLabel";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { EASE_OUT_EXPO } from "@utils/animations";
import { PORTFOLIO_PROJECTS } from "@constants/portfolio";

export default function OurWork() {
  const { t } = useTranslation();

  const filters = t("our_work.filters", { returnObjects: true });
  const stats   = t("our_work.stats", { returnObjects: true });
  const details = t("our_work.details", { returnObjects: true });

  const [active, setActive] = useState(filters[0]);
  const filtersRef = useScrollReveal();
  const statsRef   = useScrollReveal();

  const filtered = active === filters[0]
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.tag === active);

  return (
    <PageLayout>
      <PageHero
        label={t("our_work.hero_label")}
        title={t("our_work.hero_title")}
        titleAccent={t("our_work.hero_title_accent")}
        subtitle={t("our_work.hero_subtitle")}
      />

      {/* Stats */}
      <section className="py-12 sm:py-16 border-y border-fg-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.l}
                ref={statsRef.ref}
                initial={{ opacity: 0, y: 24 }}
                animate={statsRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO }}
              >
                <div className="font-display text-[clamp(2rem,5vw,3.5rem)] font-800 text-gradient mb-1">{s.v}</div>
                <div className="text-fg-40 text-xs sm:text-sm">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Filter pills */}
          <motion.div
            ref={filtersRef.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={filtersRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-14"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`font-display text-xs font-600 uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-200 ${
                  active === f
                    ? "bg-[#e85d04] text-white"
                    : "glass text-fg-50 hover:text-fg"
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>

          {/* Project grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: EASE_OUT_EXPO }}
                  className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${project.bg} border border-fg-5 group min-h-[260px] sm:min-h-[300px] flex flex-col justify-between p-6`}
                >
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <span className="font-display text-[10px] font-700 uppercase tracking-wider px-3 py-1 rounded-full bg-black/30 border border-white/10 text-white/70">
                      {project.tag}
                    </span>
                    <span className="text-3xl">{project.icon}</span>
                  </div>

                  {/* Bottom */}
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-700 text-white mb-2 leading-snug">{project.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                      <span className="text-white/60 text-xs font-500">{project.result}</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                      {details[String(project.id)]?.challenge}
                    </p>
                    <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white/40 text-[11px]">{t("our_work.duration")}: {details[String(project.id)]?.duration}</span>
                      <span className="text-white/20 text-[11px]">·</span>
                      <span className="text-white/40 text-[11px]">{t("our_work.budget")}: {details[String(project.id)]?.budget}</span>
                    </div>
                  </div>

                  {/* Glow accent */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 100%, ${project.color}22 0%, transparent 60%)` }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
              {t("our_work.cta_title")} <span className="text-gradient">{t("our_work.cta_title_accent")}</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8">
              {t("our_work.cta_subtitle")}
            </p>
            <Button href="/#contact" size="lg">{t("our_work.cta_button")}</Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
