import { motion } from "framer-motion";

const SIZE_MAP = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-sm",
  lg: "px-9 py-4 text-base",
};

const VARIANT_MAP = {
  primary: "bg-[#e85d04] text-white hover:bg-[#ff7a20] border border-[#e85d04]",
  outline: "bg-transparent text-fg border border-fg-20 hover:border-[#e85d04] hover:text-[#e85d04]",
  ghost: "bg-transparent text-fg-70 hover:text-fg border border-transparent",
};

/**
 * Animated button with glow hover effect.
 * Renders <a> when href is provided, <button> otherwise.
 */
export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
}) {
  const base = [
    "relative inline-flex items-center justify-center gap-2",
    "font-display font-semibold tracking-wide rounded-full overflow-hidden",
    "transition-all duration-300 cursor-pointer",
    disabled ? "opacity-60 cursor-not-allowed" : "",
    SIZE_MAP[size] ?? SIZE_MAP.md,
    VARIANT_MAP[variant] ?? VARIANT_MAP.primary,
    className,
  ].join(" ");

  const motionProps = {
    whileHover: { scale: 1.04, y: -1 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <motion.span
          className="absolute inset-0 rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,150,50,0.4) 0%, transparent 70%)",
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a href={href} className={base} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} className={base} {...motionProps}>
      {content}
    </motion.button>
  );
}
