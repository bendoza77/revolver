import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import SectionLabel from "@components/ui/SectionLabel";
import Button from "@components/ui/Button";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { EASE_OUT_EXPO } from "@utils/animations";
import { SERVICE_CATEGORIES } from "@constants/services";

const ACCENT = "#e85d04";

const CARD_BG = [
  "radial-gradient(circle at 0% 0%, rgba(232,93,4,0.10) 0%, transparent 60%)",
  "radial-gradient(circle at 100% 0%, rgba(232,93,4,0.10) 0%, transparent 60%)",
  "radial-gradient(circle at 0% 100%, rgba(232,93,4,0.10) 0%, transparent 60%)",
  "radial-gradient(circle at 100% 100%, rgba(232,93,4,0.10) 0%, transparent 60%)",
];

function ServiceDetailCard({ category, index }) {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE_OUT_EXPO }}
    >
      <Link
        to={category.href}
        className="group relative glass rounded-3xl p-8 sm:p-10 overflow-hidden flex flex-col h-full block border border-transparent hover:border-[#e85d04]/30 transition-all duration-500"
      >
        {/* Corner gradient accent */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
          style={{ background: CARD_BG[index % 4] }}
        />

        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e85d04]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Number watermark */}
        <span
          className="absolute top-6 right-8 font-display text-[6rem] font-800 leading-none select-none pointer-events-none"
          style={{ color: `${ACCENT}08` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#e85d04]/10 border border-[#e85d04]/20 flex items-center justify-center text-[#e85d04] mb-6 group-hover:bg-[#e85d04]/20 group-hover:scale-110 transition-all duration-300">
          <span className="scale-125">{category.icon}</span>
        </div>

        {/* Title & tagline */}
        <h2 className="font-display text-2xl sm:text-3xl font-800 text-fg mb-3 leading-tight">
          {category.title}
        </h2>
        <p className="text-fg-50 text-base mb-7 leading-relaxed">
          {category.tagline}
        </p>

        {/* Feature list */}
        <ul className="space-y-3 flex-1 mb-8">
          {category.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-fg-65">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#e85d04]/10 border border-[#e85d04]/30 flex-shrink-0 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA row */}
        <div className="flex items-center justify-between pt-5 border-t border-fg-5 group-hover:border-[#e85d04]/20 transition-colors duration-300">
          <span className="font-display text-sm font-600 text-[#e85d04] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore Service
          </span>
          <div className="w-10 h-10 rounded-full border border-fg-10 flex items-center justify-center text-fg-40 group-hover:border-[#e85d04] group-hover:text-[#e85d04] group-hover:translate-x-1 transition-all duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServicesPage() {
  const { ref: titleRef, isInView: titleInView } = useScrollReveal();

  return (
    <PageLayout>
      {/* Hero */}
      <PageHero
        label="What We Offer"
        title="Services Built for"
        titleAccent="Real Results"
        subtitle="From strategy to execution — we cover every touchpoint of your brand's digital presence. Pick a service to learn more."
      />

      {/* Service cards grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="text-center mb-12 sm:mb-16"
          >
            <SectionLabel>Our Expertise</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-800 text-fg mt-4">
              Click a service to{" "}
              <span className="text-gradient">dive deeper</span>
            </h2>
            <p className="text-fg-45 text-base mt-3 max-w-xl mx-auto leading-relaxed">
              Each service comes with a dedicated strategy, a dedicated team, and measurable outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <ServiceDetailCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="glass rounded-3xl p-10 sm:p-14 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,93,4,0.12) 0%, transparent 70%)" }}
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e85d04]/60 to-transparent" />

            <SectionLabel>Ready to Start?</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-800 text-fg mt-4 mb-3">
              Not sure which service <span className="text-gradient">fits you?</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8 leading-relaxed">
              Let's talk. We'll analyse your brand and recommend the right package — no pressure, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/#contact" size="lg">Book a Free Consultation</Button>
              <Link
                to="/pricing"
                className="font-display text-sm font-600 text-fg-50 hover:text-fg transition-colors duration-200 flex items-center gap-2"
              >
                View Pricing
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
