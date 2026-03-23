import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { getCardAnimation } from "@utils/animations";
import SectionLabel from "@components/ui/SectionLabel";
import { SERVICE_CATEGORIES } from "@constants/services";

function ServiceCard({ category, index }) {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal();
  const items = t(`services.${category.id}.items`, { returnObjects: true });

  return (
    <motion.div
      ref={ref}
      {...(isInView ? getCardAnimation(index) : { initial: { opacity: 0, y: 40 } })}
      animate={isInView ? getCardAnimation(index).animate : {}}
      className="group relative glass rounded-2xl p-6 sm:p-7 overflow-hidden cursor-default"
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: "radial-gradient(circle at 30% 30%, rgba(232,93,4,0.07) 0%, transparent 70%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e85d04]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="w-12 h-12 rounded-xl bg-[#e85d04]/10 border border-[#e85d04]/20 flex items-center justify-center text-[#e85d04] mb-5 group-hover:bg-[#e85d04]/20 transition-colors duration-300">
        {category.icon}
      </div>

      <h3 className="font-display text-xl font-700 text-fg mb-2">
        {t(`services.${category.id}.title`)}
      </h3>
      <p className="text-fg-45 text-sm mb-5 leading-relaxed">
        {t(`services.${category.id}.tagline`)}
      </p>

      <ul className="space-y-2.5">
        {items.map((svc) => (
          <li key={svc} className="flex items-start gap-2.5 text-sm text-fg-60">
            <span className="mt-1 w-3.5 h-3.5 rounded-full border border-[#e85d04]/40 flex-shrink-0 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-[#e85d04]" />
            </span>
            {svc}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-2 text-[#e85d04]/0 group-hover:text-[#e85d04] transition-colors duration-300 text-sm font-display font-semibold">
        <span>{t("services.explore")}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const { ref: titleRef, isInView: titleInView } = useScrollReveal();

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel>{t("services.label")}</SectionLabel>
          <motion.h2
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2rem,5vw,4rem)] font-800 leading-tight text-fg"
          >
            {t("services.title")}
            <br />
            <span className="text-gradient">{t("services.title_accent")}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {SERVICE_CATEGORIES.map((cat, i) => (
            <ServiceCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
