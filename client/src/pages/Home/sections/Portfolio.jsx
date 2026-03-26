import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@hooks/useScrollReveal";
import SectionLabel from "@components/ui/SectionLabel";
import { usePortfolio } from "@hooks/usePortfolio";

function ProjectCard({ project, index }) {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${project.bg} border border-fg-5 aspect-[4/3]`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    >
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="glass rounded-full px-3 py-1 text-xs font-display font-600 text-fg-70 tracking-wide">
            {project.tag}
          </span>
          <span className="text-2xl sm:text-3xl">{project.icon}</span>
        </div>

        <div>
          <motion.div
            initial={{ y: 10, opacity: 0.6 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <div className="font-display text-xs tracking-[0.15em] uppercase mb-2 font-600" style={{ color: project.color }}>
              {t("portfolio.result")}
            </div>
            <div className="font-display text-lg sm:text-xl font-700 text-fg mb-1">
              {t(`portfolio.project_${project.id}.result`, { defaultValue: project.result })}
            </div>
          </motion.div>
          <h3 className="font-display text-fg-60 text-sm">
            {t(`portfolio.project_${project.id}.title`, { defaultValue: project.title })}
          </h3>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center border-2" style={{ borderColor: project.color, color: project.color }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const { t } = useTranslation();
  const projects = usePortfolio();
  const { ref: titleRef, isInView: titleInView } = useScrollReveal();
  const filters = t("portfolio.filters", { returnObjects: true });
  const [activeFilter, setActiveFilter] = useState(0); // index into filters array

  const enFilters = ["All", "Social Media", "Video", "Branding", "Ads"];
  const filtered =
    activeFilter === 0
      ? projects
      : projects.filter((p) => p.tag === enFilters[activeFilter]);

  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel>{t("portfolio.label")}</SectionLabel>
          <motion.h2
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2rem,5vw,4rem)] font-800 leading-tight text-fg"
          >
            {t("portfolio.title")}
            <br />
            <span className="text-gradient">{t("portfolio.title_accent")}</span>
          </motion.h2>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
          {filters.map((filter, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveFilter(i)}
              whileTap={{ scale: 0.95 }}
              className={`font-display text-sm px-4 sm:px-5 py-2 rounded-full border transition-all duration-200 ${
                activeFilter === i
                  ? "bg-[#e85d04] border-[#e85d04] text-white"
                  : "glass border-fg-10 text-fg-50 hover:text-fg hover:border-fg-20"
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
