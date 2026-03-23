import { motion } from "framer-motion";
import { useScrollReveal } from "@hooks/useScrollReveal";

export default function SectionLabel({ children }) {
  const { ref, isInView } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center gap-2 mb-5"
    >
      <span className="w-6 h-px bg-[#e85d04]" />
      <span className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-[#e85d04]">
        {children}
      </span>
      <span className="w-6 h-px bg-[#e85d04]" />
    </motion.div>
  );
}
