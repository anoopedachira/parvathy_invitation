"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  cameraFloatAnimate,
  cameraFloatTransition,
} from "@/lib/motion-config";

const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ── Entrance variants ───────────────────────────────────────────

const atmosphereFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.0, ease: "easeOut" } },
};

const initialP: Variants = {
  hidden: { opacity: 0, filter: "blur(14px)", x: -10 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    transition: { duration: 2.0, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 },
  },
};

const initialAmpersand: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", scale: 0.9 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 1.1 },
  },
};

const initialH: Variants = {
  hidden: { opacity: 0, filter: "blur(14px)", x: 10 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    transition: { duration: 2.0, ease: [0.25, 0.1, 0.25, 1], delay: 1.5 },
  },
};

const cueText: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.35,
    transition: { duration: 1.6, ease: "easeOut", delay: 2.8 },
  },
};

// ── Cinematic light breathing — multiple independent cycles ─────

const primarySunlight = {
  opacity: [0.55, 0.78, 0.6, 0.55],
  x: [0, 20, -12, 0],
  y: [0, 14, -8, 0],
};
const primarySunlightTransition = {
  duration: 16,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const centerSpotlight = {
  opacity: [0.5, 0.7, 0.55, 0.5],
};
const centerSpotlightTransition = {
  duration: 10,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay: 1.5,
};

const warmBloom = {
  opacity: [0.25, 0.42, 0.28, 0.25],
};
const warmBloomTransition = {
  duration: 14,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay: 3,
};

const lightLeak = {
  opacity: [0.0, 0.18, 0.06, 0.0],
  x: [0, 10, -5, 0],
};
const lightLeakTransition = {
  duration: 18,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay: 5,
};

const hazeBreathing = {
  opacity: [0.04, 0.1, 0.06, 0.04],
};
const hazeBreathingTransition = {
  duration: 20,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay: 2,
};

// ── Exit ────────────────────────────────────────────────────────

const exitDuration = 1.8;

const frameExit = {
  opacity: 0,
  filter: "blur(10px)",
  scale: 1.04,
  transition: {
    duration: exitDuration,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
};

const atmosphereExit = {
  opacity: 0,
  transition: {
    duration: exitDuration + 0.5,
    ease: "easeOut" as const,
    delay: 0.1,
  },
};

interface OpeningFrameProps {
  onOpen: () => void;
}

export function OpeningFrame({ onOpen }: OpeningFrameProps) {
  const prefersReducedMotion = useReducedMotion();
  const noMotion = prefersReducedMotion;

  // Embossed shadow — tactile engraved quality
  const embossedShadow = [
    "0 1px 0 rgba(255, 252, 245, 0.7)",
    "0 -1px 0 rgba(42, 31, 20, 0.05)",
    "0 2px 6px rgba(42, 31, 20, 0.04)",
  ].join(", ");

  return (
    <motion.div
      className="fixed inset-0 z-50 cursor-pointer select-none"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      role="button"
      tabIndex={0}
      aria-label="Open wedding invitation"
      exit={atmosphereExit}
    >
      {/* ════════════════════════════════════════════════════════════
          PLANE 1 — Deep background: paper + base warmth
          ════════════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0"
        variants={atmosphereFade}
        initial="hidden"
        animate="visible"
      >
        {/* Base warm paper */}
        <div className="absolute inset-0 bg-[#F7F3EE]" />

        {/* Tonal drift — diagonal warmth, prevents digital uniformity */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "linear-gradient(165deg,",
              "  rgba(252, 248, 240, 0.0) 0%,",
              "  rgba(245, 236, 222, 0.18) 40%,",
              "  rgba(238, 226, 208, 0.3) 100%",
              ")",
            ].join(""),
          }}
        />

        {/* Subtle cross-tonal variation — breaks up flat planes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse 70% 55% at 25% 30%,",
              "  rgba(255, 252, 245, 0.35) 0%,",
              "  transparent 55%",
              "),",
              "radial-gradient(ellipse 50% 45% at 78% 72%,",
              "  rgba(242, 232, 218, 0.2) 0%,",
              "  transparent 50%",
              ")",
            ].join(""),
          }}
        />

        {/* Paper grain — slightly stronger for portal richness */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: GRAIN_URI,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
            opacity: 0.065,
            mixBlendMode: "multiply" as const,
          }}
        />
      </motion.div>

      {/* ════════════════════════════════════════════════════════════
          PLANE 2 — Atmospheric light: multiple breathing layers
          ════════════════════════════════════════════════════════════ */}

      {/* Primary morning sunlight — strong, asymmetric, from top-left */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2]"
        animate={noMotion ? {} : primarySunlight}
        transition={noMotion ? {} : primarySunlightTransition}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 110% 85% at 5% -15%,",
              "  rgba(255, 222, 145, 0.78) 0%,",
              "  rgba(255, 200, 95, 0.35) 28%,",
              "  rgba(255, 210, 120, 0.1) 52%,",
              "  transparent 62%",
              ")",
            ].join(""),
          }}
        />
      </motion.div>

      {/* Center spotlight — focused glow on monogram area */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[3]"
        animate={noMotion ? {} : centerSpotlight}
        transition={noMotion ? {} : centerSpotlightTransition}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 42% 38% at 50% 45%,",
              "  rgba(255, 250, 235, 0.72) 0%,",
              "  rgba(255, 245, 222, 0.3) 42%,",
              "  transparent 68%",
              ")",
            ].join(""),
          }}
        />
      </motion.div>

      {/* Warm bloom — lower center, out-of-phase with spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[4]"
        animate={noMotion ? {} : warmBloom}
        transition={noMotion ? {} : warmBloomTransition}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 55% 45% at 55% 58%,",
              "  rgba(255, 218, 140, 0.2) 0%,",
              "  rgba(255, 210, 120, 0.08) 40%,",
              "  transparent 60%",
              ")",
            ].join(""),
          }}
        />
      </motion.div>

      {/* Light leak — drifts from upper-left, very slow, barely visible */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[5]"
        animate={noMotion ? {} : lightLeak}
        transition={noMotion ? {} : lightLeakTransition}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 65% 50% at 18% 20%,",
              "  rgba(255, 240, 200, 0.25) 0%,",
              "  rgba(255, 230, 175, 0.08) 40%,",
              "  transparent 58%",
              ")",
            ].join(""),
          }}
        />
      </motion.div>

      {/* Cinematic haze — atmospheric depth between paper and monogram */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[6]"
        animate={noMotion ? {} : hazeBreathing}
        transition={noMotion ? {} : hazeBreathingTransition}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 90% 70% at 50% 50%,",
              "  rgba(255, 248, 232, 0.12) 0%,",
              "  rgba(248, 240, 225, 0.04) 45%,",
              "  transparent 65%",
              "),",
              "radial-gradient(ellipse 50% 40% at 35% 55%,",
              "  rgba(255, 242, 218, 0.06) 0%,",
              "  transparent 50%",
              ")",
            ].join(""),
          }}
        />
      </motion.div>

      {/* Deep cinematic vignette — darker edges, luminous center */}
      <div
        className="absolute inset-0 pointer-events-none z-[7]"
        style={{
          background: [
            "radial-gradient(ellipse 100% 90% at 46% 44%,",
            "  transparent 32%,",
            "  rgba(14, 8, 2, 0.12) 65%,",
            "  rgba(14, 8, 2, 0.26) 100%",
            ")",
          ].join(""),
        }}
      />

      {/* Right-edge fade — asymmetric softness */}
      <div
        className="absolute inset-0 pointer-events-none z-[8]"
        style={{
          background: [
            "linear-gradient(to right,",
            "  transparent 50%,",
            "  rgba(225, 215, 200, 0.12) 80%,",
            "  rgba(215, 205, 190, 0.18) 100%",
            ")",
          ].join(""),
        }}
      />

      {/* Bottom-edge warmth — grounding */}
      <div
        className="absolute inset-0 pointer-events-none z-[8]"
        style={{
          background:
            "linear-gradient(to top, rgba(235, 222, 205, 0.15) 0%, transparent 25%)",
        }}
      />

      {/* Top halo — diffused light spill */}
      <div
        className="absolute inset-0 pointer-events-none z-[9]"
        style={{
          background:
            "radial-gradient(ellipse 58% 25% at 48% -3%, rgba(255, 248, 225, 0.5) 0%, transparent 68%)",
        }}
      />

      {/* ════════════════════════════════════════════════════════════
          PLANE 3 — Foreground: monogram + cue
          ════════════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center"
        animate={noMotion ? {} : cameraFloatAnimate}
        transition={noMotion ? {} : cameraFloatTransition}
        exit={frameExit}
      >
        <div
          className="flex flex-col items-center text-center"
          style={{ marginTop: "-1vh" }}
        >
          {/* ── Monogram — horizontal copperplate composition ──────── */}
          <div className="relative flex items-baseline justify-center gap-[clamp(0.3rem,1.5vw,1rem)]">
            {/* P */}
            <motion.span
              variants={initialP}
              initial="hidden"
              animate="visible"
              className="font-cormorant-sc text-[#2A1F14]/78 font-light"
              style={{
                fontSize: "clamp(5rem, 18vw, 11rem)",
                lineHeight: 1,
                textShadow: embossedShadow,
              }}
            >
              P
            </motion.span>

            {/* & — delicate connector */}
            <motion.span
              variants={initialAmpersand}
              initial="hidden"
              animate="visible"
              className="font-great-vibes text-[#8B7355]/72"
              style={{
                fontSize: "clamp(1.8rem, 5.5vw, 3.2rem)",
                lineHeight: 1,
                alignSelf: "center",
                textShadow: "0 1px 0 rgba(255, 252, 245, 0.5)",
              }}
            >
              &amp;
            </motion.span>

            {/* H */}
            <motion.span
              variants={initialH}
              initial="hidden"
              animate="visible"
              className="font-cormorant-sc text-[#2A1F14]/78 font-light"
              style={{
                fontSize: "clamp(5rem, 18vw, 11rem)",
                lineHeight: 1,
                textShadow: embossedShadow,
              }}
            >
              H
            </motion.span>
          </div>

          {/* ── Ornamental mark ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 2.0 }}
            className="mt-8 mb-10 flex items-center gap-3"
            aria-hidden="true"
          >
            <div className="w-6 h-px bg-[#8B7355]/18" />
            <div className="w-1 h-1 rotate-45 border border-[#8B7355]/18" />
            <div className="w-6 h-px bg-[#8B7355]/18" />
          </motion.div>

          {/* ── Interaction cue — discovered, not instructed ────────── */}
          <motion.p
            variants={cueText}
            initial="hidden"
            animate="visible"
            className="font-inter font-light uppercase tracking-[0.6em] text-[#6B5742]"
            style={{ fontSize: "clamp(0.4rem, 0.85vw, 0.5rem)" }}
          >
            Begin
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
