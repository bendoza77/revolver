import { useEffect, useState } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { useMousePosition } from "@hooks/useMousePosition";

const INTERACTIVE = "a, button, input, textarea, select, label, [role='button']";

export default function CursorGlow() {
  const { x: rawX, y: rawY, isVisible, isTouch } = useMousePosition();
  const [hovered, setHovered] = useState(false);

  const x = useSpring(rawX, { stiffness: 200, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 200, damping: 22, mass: 0.5 });

  useEffect(() => {
    const onOver = (e) => setHovered(!!e.target.closest(INTERACTIVE));
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, []);

  if (isTouch) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cursor"
          className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
          style={{ x, y, translateX: "-50%", translateY: "-50%" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            width:  hovered ? 44 : 28,
            height: hovered ? 44 : 28,
            backgroundColor: "#e85d04",
            boxShadow: hovered
              ? "0 0 24px rgba(232,93,4,0.5)"
              : "0 0 10px rgba(232,93,4,0.3)",
            opacity: hovered ? 0.75 : 0.5,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
