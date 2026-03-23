import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@utils/animations";
import SectionLabel from "./SectionLabel";

/**
 * Reusable hero banner for inner pages.
 * Props: label, title, titleAccent, subtitle, children (optional extras)
 */
export default function PageHero({ label, title, titleAccent, subtitle, children }) {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,93,4,0.14) 0%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          {label && <SectionLabel className="mb-6">{label}</SectionLabel>}
          <h1 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-800 leading-tight text-fg mb-5">
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="text-gradient">{titleAccent}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="text-fg-50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
