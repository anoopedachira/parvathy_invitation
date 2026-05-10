import type { Transition, Variants } from "framer-motion";

// ─── Entrance Variants ────────────────────────────────────────────────────────

/** Full-scene atmosphere: slow fade, no movement */
export const atmosphereVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.6, ease: "easeOut" },
  },
};

/** Primary name lines: blur-to-sharp reveal */
export const titleVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: [0.22, 0.08, 0.24, 1], delay: 1.2 },
  },
};

/** Partner name: slightly delayed after first name */
export const partnerNameVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: [0.22, 0.08, 0.24, 1], delay: 1.68 },
  },
};

/** Ampersand script: mid-sequence reveal */
export const ampersandVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: [0.22, 0.08, 0.24, 1], delay: 1.44 },
  },
};

/** Supporting text and ornamental dividers */
export const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.3, ease: [0.22, 0.08, 0.24, 1], delay: 2.0 },
  },
};

/** Final closing divider, last to appear */
export const closingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", delay: 3.0 },
  },
};

// ─── Continuous Motion ────────────────────────────────────────────────────────

/** Imperceptible camera drift — barely-there parallax depth */
export const cameraFloatAnimate = {
  x: [0, 4, -3, 0],
  y: [0, -2, 2, 0],
};

export const cameraFloatTransition: Transition = {
  duration: 14,
  repeat: Infinity,
  ease: "easeInOut",
};

/** Slow ambient sunlight breathing + drift — simulates morning light shifting through sheer curtains */
export const sunlightAnimate = {
  opacity: [0.58, 0.82, 0.62, 0.58],
  x: [0, 18, -10, 0],
  y: [0, 12, -6, 0],
};

export const sunlightTransition: Transition = {
  duration: 15,
  repeat: Infinity,
  ease: "easeInOut",
};

/** Secondary warm glow, out-of-phase with primary sunlight */
export const warmGlowAnimate = {
  opacity: [0.3, 0.5, 0.3],
};

export const warmGlowTransition: Transition = {
  duration: 16,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
  delay: 2,
};
