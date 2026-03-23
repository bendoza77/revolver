import { useEffect, useState } from "react";
import { useMotionValue } from "framer-motion";

/**
 * Returns raw (unsprung) motion values so consumers can apply
 * their own spring configs per layer.
 */
export function useMousePosition() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch]     = useState(false);
  // isTouch: hide the circle on touch-only devices

  const x = useMotionValue(-300);
  const y = useMotionValue(-300);

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
    };
    const onLeave  = () => setIsVisible(false);
    const onTouch  = () => setIsTouch(true);

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchstart", onTouch, { once: true });

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  return { x, y, isVisible, isTouch };
}
