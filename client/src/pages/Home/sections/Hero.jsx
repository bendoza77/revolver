import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@components/ui/Button";
import { HERO_STATS } from "@constants/services";

const FLOAT_CARDS_KEYS = [
  { labelKey: "hero.float.reach",       x: "-18%", y: "20%", delay: 0.3 },
  { labelKey: "hero.float.conversions", x: "78%",  y: "30%", delay: 0.5 },
  { labelKey: "hero.float.roi",         x: "72%",  y: "68%", delay: 0.7 },
];

const FLOAT_VALUES = ["+340%", "+210%", "4.8x"];
const STAT_KEYS = ["brands", "roi", "reach"];
const ORBIT_DEGREES = [0, 60, 120, 180, 240, 300];

export default function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const ringY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const lines = [
    t("hero.line1"),
    t("hero.line2"),
    t("hero.line3"),
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-pattern"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,93,4,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Rotating ring — parallaxes independently */}
      <motion.div
        style={{ y: ringY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div className="relative w-[600px] h-[600px] max-w-[90vw] max-h-[90vw]">
          <div className="absolute inset-0 rounded-full border border-fg-5 spin-slow" />
          <div className="absolute inset-8 rounded-full border border-fg-5" style={{ animation: "spin-slow 30s linear infinite reverse" }} />
          <div className="absolute inset-16 rounded-full border border-[#e85d04]/10 spin-slow" style={{ animationDuration: "15s" }} />
          {ORBIT_DEGREES.map((deg, i) => (
            <motion.div
              key={deg}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#e85d04]/40"
              style={{ top: "50%", left: "50%", transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(280px)` }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main content — no parallax */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 sm:mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-[#e85d04] pulse-glow" />
          <span className="font-display text-xs tracking-[0.15em] uppercase text-fg-70">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* Headline */}
        {lines.map((line, i) => (
          <div key={i} className="overflow-hidden mb-3 sm:mb-6">
            <motion.h1
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.1 }}
              className={`font-display text-[clamp(2.6rem,10vw,8rem)] font-800 leading-[0.95] tracking-tight ${
                i === 1 ? "text-gradient" : "text-fg"
              }`}
            >
              {line}
            </motion.h1>
          </div>
        ))}

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
          className="max-w-xl mx-auto text-fg-55 text-base sm:text-lg leading-relaxed mb-10 sm:mb-12 font-light px-2"
        >
          {t("hero.sub")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16 sm:mb-20"
        >
          <Button href="#contact" size="lg">
            <span>{t("hero.cta_primary")}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
          <Button href="#services" variant="outline" size="lg">
            {t("hero.cta_secondary")}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16"
        >
          {HERO_STATS.map((stat, i) => (
            <div key={stat.value} className="flex flex-col items-center gap-1">
              <span className="font-display text-3xl sm:text-4xl font-700 text-gradient">
                {stat.value}
              </span>
              <span className="text-fg-40 text-xs sm:text-sm tracking-wide uppercase font-display">
                {t(`hero.stats.${STAT_KEYS[i]}`)}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating metric cards (desktop only) */}
      {FLOAT_CARDS_KEYS.map((card, i) => (
        <motion.div
          key={card.labelKey}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: card.delay + 0.8, ease: "easeOut" }}
          className="hidden lg:block absolute glass rounded-2xl px-5 py-3 pointer-events-none"
          style={{ left: card.x, top: card.y }}
        >
          <div className="font-display text-xl font-700 text-[#e85d04]">{FLOAT_VALUES[i]}</div>
          <div className="text-fg-50 text-xs tracking-widest uppercase">{t(card.labelKey)}</div>
        </motion.div>
      ))}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-fg-30 text-xs tracking-[0.2em] uppercase font-display">
          {t("hero.scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#e85d04]/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
