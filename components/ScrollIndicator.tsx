"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Faint vertical scroll progress line — right edge.
 * Reads as an editorial whisper, not a UI progress bar.
 */
export function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // scaleY drives the line height from 0→1
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.95, 1], [0, 0.3, 0.3, 0]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed top-0 right-[18px] h-full z-50 pointer-events-none group"
      style={{ width: "1px" }}
    >
      <motion.div
        className="origin-top w-full h-full transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(139,115,85,0.4)]"
        style={{
          scaleY,
          opacity,
          background: "linear-gradient(to bottom, #8B7355, #C4A97D)",
        }}
      />
    </div>
  );
}
