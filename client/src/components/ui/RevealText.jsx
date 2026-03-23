import { motion } from "framer-motion";
import { useScrollReveal } from "@hooks/useScrollReveal";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const wordVariant = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function RevealText({ children, className = "", delay = 0 }) {
  const { ref, isInView } = useScrollReveal();
  const words = String(children).split(" ");

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ transitionDelay: `${delay}s` }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={wordVariant}
            style={{ marginRight: "0.28em" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
