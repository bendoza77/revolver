import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@hooks/useScrollReveal";
import SectionLabel from "@components/ui/SectionLabel";
import Button from "@components/ui/Button";
import { PRICING_PLANS, ADDON_PRICES, TIKTOK_PRICES } from "@constants/pricing";

function PricingCard({ plan, index }) {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal();
  const features = t(`pricing.${plan.key}.features`, { returnObjects: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl overflow-hidden flex flex-col ${
        plan.popular
          ? "border border-[#e85d04]/50 glow-orange-sm"
          : "glass border-fg-7"
      }`}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      style={
        plan.popular
          ? { background: "linear-gradient(160deg, rgba(232,93,4,0.12) 0%, color-mix(in srgb, var(--bg) 95%, transparent) 40%)" }
          : {}
      }
    >
      {plan.popular && (
        <>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e85d04] to-transparent" />
          <div className="absolute top-4 right-4">
            <span className="font-display text-[10px] font-700 tracking-[0.15em] uppercase bg-[#e85d04] text-white px-3 py-1 rounded-full">
              {t("pricing.popular")}
            </span>
          </div>
        </>
      )}

      <div className="p-6 sm:p-8 flex-1">
        <div className="mb-6">
          <h3 className="font-display text-base sm:text-lg font-600 text-fg-60 mb-2 tracking-widest uppercase">
            {t(`pricing.${plan.key}.name`)}
          </h3>
          <div className="flex items-end gap-1 mb-2">
            <span className="font-display text-4xl sm:text-5xl font-800 text-fg">
              {plan.price}
            </span>
            <span className="text-fg-40 text-sm mb-2">{t("pricing.period")}</span>
          </div>
          <p className="inline-flex items-center gap-1.5 text-[#e85d04]/80 text-sm font-display font-600 tracking-wide">
            <span className="text-[#e85d04]">✦</span>
            {t(`pricing.${plan.key}.tagline`)}
          </p>
        </div>

        <div className="h-px bg-fg-7 mb-6" />

        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-fg-65">
              <svg className="mt-0.5 flex-shrink-0 text-[#e85d04]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
        <Button href="#contact" variant={plan.popular ? "primary" : "outline"} className="w-full">
          {t(`pricing.${plan.key}.cta`)}
        </Button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const { t } = useTranslation();
  const { ref: titleRef, isInView: titleInView } = useScrollReveal();
  const { ref: addonsRef, isInView: addonsInView } = useScrollReveal();
  const { ref: tiktokRef, isInView: tiktokInView } = useScrollReveal();

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 20% 50%, rgba(232,93,4,0.05) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel>{t("pricing.label")}</SectionLabel>
          <motion.h2
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2rem,5vw,4rem)] font-800 leading-tight text-fg"
          >
            {t("pricing.title")}
            <br />
            <span className="text-gradient">{t("pricing.title_accent")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-fg-45 mt-4 max-w-md mx-auto text-sm px-4"
          >
            {t("pricing.subtitle")}
          </motion.p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-16 sm:mb-20">
          {PRICING_PLANS.map((plan, i) => (
            <PricingCard key={plan.key} plan={plan} index={i} />
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          ref={addonsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={addonsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 sm:mb-16"
        >
          <h3 className="font-display text-xl font-700 text-fg mb-6 sm:mb-8 text-center">
            {t("pricing.addons.title")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Reel */}
            <div className="glass rounded-xl px-5 py-5 flex flex-col gap-3 hover:border-[#e85d04]/25 transition-colors duration-300">
              <span className="text-[#e85d04] font-display text-[10px] font-700 tracking-[0.18em] uppercase">
                {t("pricing.addons.group_video")}
              </span>
              <div>
                <div className="font-display text-fg-85 text-sm font-600 leading-snug">{t("pricing.addons.reel_name")}</div>
                <div className="text-fg-35 text-xs mt-1">{t("pricing.addons.reel_desc")}</div>
              </div>
              <span className="text-[#e85d04] font-display font-800 text-xl mt-auto">{ADDON_PRICES.reel}</span>
            </div>

            {/* Google Ads */}
            <div className="glass rounded-xl px-5 py-5 flex flex-col gap-3 hover:border-[#e85d04]/25 transition-colors duration-300">
              <span className="text-[#e85d04] font-display text-[10px] font-700 tracking-[0.18em] uppercase">
                {t("pricing.addons.group_video")}
              </span>
              <div>
                <div className="font-display text-fg-85 text-sm font-600 leading-snug">{t("pricing.addons.google_name")}</div>
                <div className="text-fg-35 text-xs mt-1">{t("pricing.addons.google_desc")}</div>
              </div>
              <span className="text-[#e85d04] font-display font-800 text-xl mt-auto">{ADDON_PRICES.google}</span>
            </div>

            {/* Audio */}
            <div className="glass rounded-xl px-5 py-5 flex flex-col gap-3 hover:border-[#e85d04]/25 transition-colors duration-300">
              <span className="text-[#e85d04] font-display text-[10px] font-700 tracking-[0.18em] uppercase">
                {t("pricing.addons.group_audio")}
              </span>
              <div>
                <div className="font-display text-fg-85 text-sm font-600 leading-snug">{t("pricing.addons.audio_name")}</div>
                <div className="text-fg-35 text-xs mt-1">{t("pricing.addons.audio_desc")}</div>
              </div>
              <span className="text-[#e85d04] font-display font-800 text-xl mt-auto">{ADDON_PRICES.audio}</span>
            </div>
          </div>

          <p className="text-center text-fg-30 text-xs mt-6 font-display tracking-wide">
            * {t("pricing.addons.note")}
          </p>
        </motion.div>

        {/* TikTok packages */}
        <motion.div
          ref={tiktokRef}
          initial={{ opacity: 0, y: 30 }}
          animate={tiktokInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#e85d04">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.8 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z" />
            </svg>
            <h3 className="font-display text-xl font-700 text-fg">{t("pricing.tiktok.title")}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl mx-auto">
            <div className="glass rounded-2xl px-6 sm:px-7 py-6 flex items-center justify-between gap-4 hover:border-[#e85d04]/30 transition-all duration-300">
              <div>
                <div className="font-display text-fg-50 text-xs tracking-widest uppercase mb-1">
                  {t("pricing.tiktok.starter_name")}
                </div>
                <div className="font-display text-fg font-700 text-base sm:text-lg">
                  {t("pricing.tiktok.starter_videos")}
                </div>
              </div>
              <span className="text-[#e85d04] font-display font-800 text-lg sm:text-xl whitespace-nowrap">
                {TIKTOK_PRICES.starter}
              </span>
            </div>
            <div className="glass rounded-2xl px-6 sm:px-7 py-6 flex items-center justify-between gap-4 hover:border-[#e85d04]/30 transition-all duration-300">
              <div>
                <div className="font-display text-fg-50 text-xs tracking-widest uppercase mb-1">
                  {t("pricing.tiktok.growth_name")}
                </div>
                <div className="font-display text-fg font-700 text-base sm:text-lg">
                  {t("pricing.tiktok.growth_videos")}
                </div>
              </div>
              <span className="text-[#e85d04] font-display font-800 text-lg sm:text-xl whitespace-nowrap">
                {TIKTOK_PRICES.growth}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
