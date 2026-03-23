/** Shared Framer Motion variants used across the project */

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1];

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export const cardHover = {
  rest: { y: 0 },
  hover: {
    y: -6,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const cardHoverSmall = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/** Returns staggered card animation props by index */
export const getCardAnimation = (index, delay = 0.12) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: index * delay, ease: EASE_OUT_EXPO },
});
