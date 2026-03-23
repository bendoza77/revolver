import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageLayout from "@components/layout/PageLayout";
import PageHero from "@components/ui/PageHero";
import Button from "@components/ui/Button";
import SectionLabel from "@components/ui/SectionLabel";
import { useScrollReveal } from "@hooks/useScrollReveal";
import { EASE_OUT_EXPO } from "@utils/animations";
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
      transition={{ duration: 0.65, delay: index * 0.13, ease: EASE_OUT_EXPO }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className={`relative rounded-2xl overflow-hidden flex flex-col ${
        plan.popular
          ? "border border-[#e85d04]/50 glow-orange-sm"
          : "glass border-fg-7"
      }`}
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
          <h3 className="font-display text-base font-600 text-fg-60 mb-2 tracking-widest uppercase">
            {t(`pricing.${plan.key}.name`)}
          </h3>
          <div className="flex items-end gap-1 mb-2">
            <span className="font-display text-4xl sm:text-5xl font-800 text-fg">{plan.price}</span>
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
        <Button href="/#contact" variant={plan.popular ? "primary" : "outline"} className="w-full">
          {t(`pricing.${plan.key}.cta`)}
        </Button>
      </div>
    </motion.div>
  );
}

export default function PricingPage() {
  const { t } = useTranslation();
  const plansRef  = useScrollReveal();
  const addonsRef = useScrollReveal();
  const tiktokRef = useScrollReveal();
  const faqRef    = useScrollReveal();

  const faq = t("pricing_page.faq", { returnObjects: true });

  return (
    <PageLayout>
      <PageHero
        label={t("pricing_page.hero_label")}
        title={t("pricing_page.hero_title")}
        titleAccent={t("pricing_page.hero_title_accent")}
        subtitle={t("pricing_page.hero_subtitle")}
      />

      {/* Plans */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={plansRef.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={plansRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="text-center mb-12"
          >
            <SectionLabel>{t("pricing_page.plans_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-800 text-fg mt-4">
              {t("pricing_page.plans_title")} <span className="text-gradient">{t("pricing_page.plans_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {PRICING_PLANS.map((plan, i) => (
              <PricingCard key={plan.key} plan={plan} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Addons */}
      <section className="section-padding bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={addonsRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={addonsRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-12"
          >
            <SectionLabel>Add-ons</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-800 text-fg mt-4">
              {t("pricing.addons.title")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { group: t("pricing.addons.group_video"), name: t("pricing.addons.reel_name"), desc: t("pricing.addons.reel_desc"), price: ADDON_PRICES.reel },
              { group: t("pricing.addons.group_video"), name: t("pricing.addons.google_name"), desc: t("pricing.addons.google_desc"), price: ADDON_PRICES.google },
              { group: t("pricing.addons.group_audio"), name: t("pricing.addons.audio_name"), desc: t("pricing.addons.audio_desc"), price: ADDON_PRICES.audio },
            ].map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 30 }}
                animate={addonsRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6 flex flex-col gap-3 hover:border-[#e85d04]/25 transition-colors duration-300"
              >
                <span className="text-[#e85d04] font-display text-[10px] font-700 tracking-[0.18em] uppercase">{a.group}</span>
                <div>
                  <div className="font-display text-fg font-700 text-sm leading-snug">{a.name}</div>
                  <div className="text-fg-35 text-xs mt-1">{a.desc}</div>
                </div>
                <span className="text-[#e85d04] font-display font-800 text-2xl mt-auto">{a.price}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-fg-30 text-xs mt-6 font-display tracking-wide">
            * {t("pricing.addons.note")}
          </p>
        </div>
      </section>

      {/* TikTok */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={tiktokRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={tiktokRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#e85d04">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.8 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z"/>
              </svg>
              <SectionLabel>{t("pricing.tiktok.title")}</SectionLabel>
            </div>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-800 text-fg">
              TikTok <span className="text-gradient">Growth Packages.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: t("pricing.tiktok.starter_name"), videos: t("pricing.tiktok.starter_videos"), price: TIKTOK_PRICES.starter },
              { name: t("pricing.tiktok.growth_name"), videos: t("pricing.tiktok.growth_videos"), price: TIKTOK_PRICES.growth },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                animate={tiktokRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl px-7 py-6 flex items-center justify-between gap-4 hover:border-[#e85d04]/30 transition-all duration-300"
              >
                <div>
                  <div className="font-display text-fg-50 text-xs tracking-widest uppercase mb-1">{p.name}</div>
                  <div className="font-display text-fg font-700 text-lg">{p.videos}</div>
                </div>
                <span className="text-[#e85d04] font-display font-800 text-xl whitespace-nowrap">{p.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            ref={faqRef.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={faqRef.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="text-center mb-10 sm:mb-12"
          >
            <SectionLabel>{t("pricing_page.faq_label")}</SectionLabel>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-800 text-fg mt-4">
              {t("pricing_page.faq_title")} <span className="text-gradient">{t("pricing_page.faq_title_accent")}</span>
            </h2>
          </motion.div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 24 }}
                animate={faqRef.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT_EXPO }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-base font-700 text-fg mb-2">{item.q}</h3>
                <p className="text-fg-50 text-sm leading-relaxed">{item.a}</p>
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
              {t("pricing_page.cta_title")} <span className="text-gradient">{t("pricing_page.cta_title_accent")}</span>
            </h2>
            <p className="text-fg-50 text-base sm:text-lg mb-8">
              {t("pricing_page.cta_subtitle")}
            </p>
            <Button href="/#contact" size="lg">{t("pricing_page.cta_button")}</Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
