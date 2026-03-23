import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@hooks/useScrollReveal";
import SectionLabel from "@components/ui/SectionLabel";
import { BENEFITS, PROCESS_STEPS } from "@constants/benefits";

function BenefitCard({ benefit, index }) {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group glass rounded-2xl p-5 sm:p-6 relative overflow-hidden"
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 0% 0%, rgba(232,93,4,0.06) 0%, transparent 60%)" }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-[#e85d04]/10 border border-[#e85d04]/20 flex items-center justify-center text-[#e85d04]">
          {benefit.icon}
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-700 text-gradient">{benefit.stat}</div>
          <div className="text-fg-35 text-[10px] tracking-widest uppercase">
            {t(`benefits.${benefit.id}.stat_label`)}
          </div>
        </div>
      </div>
      <h3 className="font-display text-base sm:text-lg font-700 text-fg mb-2">
        {t(`benefits.${benefit.id}.title`)}
      </h3>
      <p className="text-fg-50 text-sm leading-relaxed">
        {t(`benefits.${benefit.id}.description`)}
      </p>
    </motion.div>
  );
}

function ProcessStep({ step, index }) {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      className="flex flex-col items-center text-center px-2"
    >
      <div className="w-14 h-14 rounded-full border-2 border-[#e85d04]/40 flex items-center justify-center mb-4 bg-bg relative z-10">
        <span className="font-display text-xl font-800 text-[#e85d04]">{step.step}</span>
      </div>
      <h4 className="font-display font-700 text-fg text-sm sm:text-base mb-1">
        {t(`benefits.process.${step.step}.title`)}
      </h4>
      <p className="text-fg-45 text-sm leading-relaxed">
        {t(`benefits.process.${step.step}.desc`)}
      </p>
    </motion.div>
  );
}

export default function Benefits() {
  const { t } = useTranslation();
  const { ref: titleRef, isInView: titleInView } = useScrollReveal();

  return (
    <section id="benefits" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(232,93,4,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel>{t("benefits.label")}</SectionLabel>
          <motion.h2
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2rem,5vw,4rem)] font-800 leading-tight text-fg"
          >
            {t("benefits.title")}
            <br />
            <span className="text-gradient">{t("benefits.title_accent")}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-20">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={b.id} benefit={b} index={i} />
          ))}
        </div>

        {/* Process timeline */}
        <div className="relative">
          <div className="hidden md:block absolute top-7 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(232,93,4,0.3) 20%, rgba(232,93,4,0.3) 80%, transparent)" }} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {PROCESS_STEPS.map((p, i) => (
              <ProcessStep key={p.step} step={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
