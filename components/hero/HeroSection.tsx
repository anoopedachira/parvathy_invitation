"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import {
  atmosphereVariants,
  titleVariants,
  partnerNameVariants,
  ampersandVariants,
  subtitleVariants,
  cameraFloatAnimate,
  cameraFloatTransition,
  sunlightAnimate,
  sunlightTransition,
  warmGlowAnimate,
  warmGlowTransition,
} from "@/lib/motion-config";

// SVG noise texture encoded as data URI for film-grain paper feel
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ── Timed reveal variants for sub-elements within scenes ────────

const timedFadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 12, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.35, ease: [0.22, 0.08, 0.24, 1], delay },
  },
});

const timedFade = (delay: number, finalOpacity = 1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: finalOpacity,
    transition: { duration: 1.0, ease: "easeOut", delay },
  },
});

export function HeroSection({ revealed = true }: { revealed?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();

  // Animation state: entrance animations fire only after cover opens
  const animateState = revealed ? "visible" : "hidden";

  // ── Scroll-progress-based scene triggers ──────────────────────
  // Fires once when scroll reaches each scene's entry point
  const [scene2Active, setScene2Active] = useState(false);
  const [scene3Active, setScene3Active] = useState(false);
  const [scene4Active, setScene4Active] = useState(false);

  // ── Auto-advance: idle on Scene 1 → gently scroll to Scene 2 ──
  const [autoAdvanced, setAutoAdvanced] = useState(false);
  const hasScrolled = useRef(false);

  const autoScroll = useCallback(() => {
    if (hasScrolled.current || autoAdvanced || !containerRef.current) return;
    setAutoAdvanced(true);
    const target = containerRef.current.offsetHeight * 0.08;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, [autoAdvanced]);

  // Start 5s idle timer once cover opens
  useEffect(() => {
    if (!revealed || autoAdvanced) return;
    const timer = setTimeout(autoScroll, 5000);
    const markScrolled = () => { hasScrolled.current = true; };
    window.addEventListener("scroll", markScrolled, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", markScrolled);
    };
  }, [revealed, autoAdvanced, autoScroll]);

  // Canvas: 500vh total (adjusted for mobile scroll and full scene visibility)
  // max reachable = (500-100)/500 = 0.8
  const scrollYProgress = useTransform(scrollY, (y) => {
    if (!containerRef.current) return 0;
    return Math.min(y / containerRef.current.offsetHeight, 1);
  });

  // Trigger scene animations when scroll progress enters their range
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!scene2Active && latest >= 0.18) setScene2Active(true);
    if (!scene3Active && latest >= 0.46) setScene3Active(true);
    if (!scene4Active && latest >= 0.76) setScene4Active(true);
  });

  const noMove = prefersReducedMotion;

  // ── Multi-plane parallax depth system ─────────────────────────
  const bgDeepY = useTransform(
    scrollYProgress, [0, 1],
    noMove ? ["0%", "0%"] : ["0%", "-2%"]
  );
  const bgMidY = useTransform(
    scrollYProgress, [0, 1],
    noMove ? ["0%", "0%"] : ["0%", "-4%"]
  );
  const bgNearY = useTransform(
    scrollYProgress, [0, 1],
    noMove ? ["0%", "0%"] : ["0%", "-7%"]
  );
  const bgForegroundY = useTransform(
    scrollYProgress, [0, 1],
    noMove ? ["0%", "0%"] : ["0%", "-10%"]
  );

  // ── Scroll-driven lighting ────────────────────────────────────
  const lightWarmth = useTransform(scrollYProgress, [0, 0.5, 0.9], [0, 0.3, 0.7]);
  const goldenBloomOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 0.35]);
  const continuationGlowOpacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.30, 0.60, 0.80, 1],
    [0.25, 0.35, 0.28, 0.32, 0.18, 0.06]
  );
  const continuationCueOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.78, 1],
    [0.18, 0.14, 0.16, 0.04]
  );
  const continuationCueY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    noMove ? [0, 0, 0] : [0, -6, -12]
  );

  // ── Soft bokeh drift (very subtle depth layer) ───────────────
  const bokehLayerOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    [0.13, 0.17, 0.15, 0.1]
  );
  const bokehAOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0.08, 0.12, 0.1, 0.06]
  );
  const bokehBOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.7, 1],
    [0.06, 0.1, 0.11, 0.07]
  );

  // ── Cinematic spotlights — asymmetric pools that shift per scene ──
  const spotlightPrimaryPos = useTransform(
    scrollYProgress,
    [0, 0.15, 0.42, 0.72, 1],
    [
      "radial-gradient(ellipse 38% 55% at 42% 38%, rgba(255, 248, 230, 0.22) 0%, transparent 68%)",
      "radial-gradient(ellipse 42% 50% at 50% 42%, rgba(255, 245, 220, 0.26) 0%, transparent 65%)",
      "radial-gradient(ellipse 45% 48% at 48% 45%, rgba(255, 242, 210, 0.28) 0%, transparent 62%)",
      "radial-gradient(ellipse 40% 52% at 52% 48%, rgba(255, 238, 195, 0.30) 0%, transparent 66%)",
      "radial-gradient(ellipse 44% 50% at 50% 50%, rgba(255, 235, 185, 0.25) 0%, transparent 70%)",
    ]
  );
  const spotlightSecondaryPos = useTransform(
    scrollYProgress,
    [0, 0.20, 0.50, 0.80, 1],
    [
      "radial-gradient(ellipse 25% 35% at 72% 28%, rgba(255, 240, 210, 0.10) 0%, transparent 60%)",
      "radial-gradient(ellipse 28% 32% at 25% 62%, rgba(255, 238, 200, 0.12) 0%, transparent 58%)",
      "radial-gradient(ellipse 30% 38% at 78% 55%, rgba(255, 235, 190, 0.14) 0%, transparent 55%)",
      "radial-gradient(ellipse 26% 34% at 30% 42%, rgba(255, 232, 180, 0.16) 0%, transparent 60%)",
      "radial-gradient(ellipse 28% 36% at 65% 65%, rgba(255, 228, 170, 0.12) 0%, transparent 62%)",
    ]
  );
  const spotlightOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 0.80, 1],
    [0, 0.6, 1, 1, 0.7]
  );

  // ═══════════════════════════════════════════════════════════════
  // SCENE TRANSITIONS — scroll controls scene enter/exit only
  // Sub-elements auto-animate with timed delays via useInView
  // ═══════════════════════════════════════════════════════════════

  // Scene 1: Names (hold → dissolve 0.12→0.15)
  const namesOpacity = useTransform(scrollYProgress, [0, 0.12, 0.15], [1, 1, 0]);
  const namesScale = useTransform(
    scrollYProgress, [0, 0.15],
    noMove ? [1, 1] : [1, 0.97]
  );

  // Scene 2: Invitation (appear 0.15→0.22, hold, dissolve 0.35→0.42)
  const inviteOpacity = useTransform(
    scrollYProgress, [0.15, 0.22, 0.35, 0.42], [0, 1, 1, 0]
  );
  const inviteFilter = useTransform(
    scrollYProgress, [0.15, 0.22], ["blur(8px)", "blur(0px)"]
  );

  // Scene 3: Day Reveal (appear 0.42→0.50, hold, dissolve 0.65→0.72)
  const dayRevealOpacity = useTransform(
    scrollYProgress, [0.42, 0.50, 0.65, 0.72], [0, 1, 1, 0]
  );

  // Scene 4: Warm Closing (appear 0.72→0.80, hold through end)
  const closingOpacity = useTransform(
    scrollYProgress, [0.72, 0.80], [0, 1]
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[500vh]"
      aria-label="Wedding invitation"
    >
      {/* ── Sticky viewport ──────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Atmosphere layers — 4 parallax depth planes ──────── */}

        {/* PLANE 1 — DEEP BACK */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: bgDeepY, inset: "-5%" }}
          variants={atmosphereVariants}
          initial="hidden"
          animate={animateState}
        >
          <div className="absolute inset-0 bg-[#F7F3EE]" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse 120% 100% at 30% 20%,",
                "  rgba(255, 252, 245, 0.7) 0%,",
                "  rgba(248, 242, 230, 0.3) 35%,",
                "  transparent 60%",
                "),",
                "radial-gradient(ellipse 90% 80% at 80% 90%,",
                "  rgba(242, 234, 220, 0.35) 0%,",
                "  transparent 50%",
                "),",
                "linear-gradient(165deg,",
                "  rgba(255, 250, 240, 0.0) 0%,",
                "  rgba(248, 240, 225, 0.15) 45%,",
                "  rgba(240, 230, 210, 0.25) 100%",
                ")",
              ].join(""),
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: GRAIN_URI,
              backgroundRepeat: "repeat",
              backgroundSize: "180px 180px",
              opacity: 0.04,
              mixBlendMode: "multiply" as const,
            }}
          />
        </motion.div>

        {/* PLANE 2 — MID DEPTH */}
        <motion.div
          className="absolute"
          style={{ y: bgMidY, inset: "-5%" }}
          variants={atmosphereVariants}
          initial="hidden"
          animate={animateState}
        >
          <motion.div
            className="absolute inset-0"
            animate={prefersReducedMotion ? {} : sunlightAnimate}
            transition={prefersReducedMotion ? {} : sunlightTransition}
            style={{
              background: [
                "radial-gradient(ellipse 95% 75% at 10% -10%,",
                "  rgba(255, 228, 155, 0.68) 0%,",
                "  rgba(255, 208, 105, 0.28) 35%,",
                "  transparent 58%",
                "),",
                "radial-gradient(ellipse 40% 35% at 92% 15%,",
                "  rgba(245, 238, 225, 0.18) 0%,",
                "  transparent 55%",
                ")",
              ].join(""),
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform(
                scrollYProgress,
                [0, 0.25, 0.5, 0.75, 1],
                [
                  "radial-gradient(ellipse 45% 40% at 30% 20%, rgba(255, 245, 220, 0.3) 0%, transparent 60%)",
                  "radial-gradient(ellipse 50% 45% at 50% 30%, rgba(255, 240, 200, 0.4) 0%, transparent 65%)",
                  "radial-gradient(ellipse 55% 50% at 70% 40%, rgba(255, 235, 180, 0.35) 0%, transparent 70%)",
                  "radial-gradient(ellipse 60% 55% at 60% 60%, rgba(255, 230, 160, 0.45) 0%, transparent 75%)",
                  "radial-gradient(ellipse 65% 60% at 50% 80%, rgba(255, 225, 140, 0.5) 0%, transparent 80%)",
                ]
              ),
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform(
                scrollYProgress,
                [0, 0.3, 0.6, 1],
                [
                  "radial-gradient(ellipse 35% 30% at 80% 10%, rgba(255, 250, 235, 0.2) 0%, transparent 50%)",
                  "radial-gradient(ellipse 40% 35% at 20% 50%, rgba(255, 245, 215, 0.25) 0%, transparent 55%)",
                  "radial-gradient(ellipse 45% 40% at 90% 70%, rgba(255, 240, 195, 0.3) 0%, transparent 60%)",
                  "radial-gradient(ellipse 50% 45% at 30% 90%, rgba(255, 235, 175, 0.35) 0%, transparent 65%)",
                ]
              ),
            }}
          />
          <motion.div
            className="absolute inset-0"
            animate={prefersReducedMotion ? {} : warmGlowAnimate}
            transition={prefersReducedMotion ? {} : warmGlowTransition}
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 88% 95%, rgba(255, 218, 140, 0.15) 0%, transparent 55%)",
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: lightWarmth }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(255, 215, 140, 0.18) 0%, rgba(240, 195, 100, 0.06) 50%, transparent 70%)",
              }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: goldenBloomOpacity }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: [
                  "radial-gradient(ellipse 80% 60% at 30% 60%,",
                  "  rgba(255, 200, 100, 0.25) 0%,",
                  "  transparent 55%",
                  "),",
                  "radial-gradient(ellipse 70% 50% at 70% 40%,",
                  "  rgba(255, 220, 140, 0.18) 0%,",
                  "  transparent 50%",
                  ")",
                ].join(""),
              }}
            />
          </motion.div>
        </motion.div>

        {/* PLANE 3 — NEAR ATMOSPHERE */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: bgNearY, inset: "-5%" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 70% 50% at 40% 35%,",
                "  rgba(255, 252, 245, 0.12) 0%,",
                "  transparent 50%",
                "),",
                "radial-gradient(ellipse 55% 40% at 65% 70%,",
                "  rgba(250, 245, 232, 0.1) 0%,",
                "  transparent 45%",
                "),",
                "radial-gradient(ellipse 40% 30% at 20% 80%,",
                "  rgba(248, 240, 225, 0.08) 0%,",
                "  transparent 40%",
                ")",
              ].join(""),
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: GRAIN_URI,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
              opacity: 0.055,
              mixBlendMode: "multiply" as const,
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.15, 0.25, 0.2, 0.1]),
              background: [
                "linear-gradient(135deg,",
                "  transparent 20%,",
                "  rgba(255, 248, 230, 0.08) 35%,",
                "  transparent 37%,",
                "  transparent 52%,",
                "  rgba(255, 245, 220, 0.06) 58%,",
                "  transparent 60%,",
                "  transparent 75%,",
                "  rgba(255, 242, 210, 0.04) 82%,",
                "  transparent 84%",
                ")",
              ].join(""),
            }}
          />
        </motion.div>

        {/* PLANE 4 — FOREGROUND DEPTH */}
        <motion.div
          className="absolute pointer-events-none z-10"
          style={{ y: bgForegroundY, inset: "-5%" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 120% 110% at 45% 48%,",
                "  transparent 42%,",
                "  rgba(14, 8, 2, 0.15) 100%",
                "),",
                "radial-gradient(ellipse 50% 80% at 100% 50%,",
                "  rgba(235, 225, 210, 0.12) 0%,",
                "  transparent 60%",
                ")",
              ].join(""),
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(to right,",
                "  rgba(30, 20, 10, 0.06) 0%,",
                "  transparent 12%,",
                "  transparent 88%,",
                "  rgba(30, 20, 10, 0.04) 100%",
                "),",
                "linear-gradient(to bottom,",
                "  transparent 0%,",
                "  transparent 85%,",
                "  rgba(30, 20, 10, 0.06) 100%",
                ")",
              ].join(""),
            }}
          />
        </motion.div>

        {/* Top halo (fixed) */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 65% 30% at 50% -1%, rgba(255, 248, 228, 0.45) 0%, transparent 72%)",
          }}
        />

        {/* ── Cinematic Spotlight Layer ──────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[15]"
          style={{ opacity: spotlightOpacity }}
        >
          {/* Primary spotlight — slightly left-of-centre, follows scenes */}
          <motion.div
            className="absolute inset-0"
            style={{ background: spotlightPrimaryPos }}
            animate={
              prefersReducedMotion
                ? undefined
                : { scale: [1, 1.03, 1], opacity: [0.85, 1, 0.85] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 12, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }
            }
          />
          {/* Secondary accent spotlight — asymmetric, shifts across scenes */}
          <motion.div
            className="absolute inset-0"
            style={{ background: spotlightSecondaryPos }}
            animate={
              prefersReducedMotion
                ? undefined
                : { scale: [1, 0.97, 1], opacity: [0.7, 1, 0.7] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 16, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }
            }
          />
          {/* Sharp edge highlight — raking light from upper-left */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(148deg,",
                "  rgba(255, 250, 235, 0.14) 0%,",
                "  rgba(255, 245, 218, 0.06) 18%,",
                "  transparent 32%",
                ")",
              ].join(""),
            }}
          />
        </motion.div>

        {/* ── Soft Bokeh Layer ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[12]"
          style={{ opacity: bokehLayerOpacity }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              left: "10%",
              top: "16%",
              width: "52vw",
              height: "52vw",
              maxWidth: "680px",
              maxHeight: "680px",
              background:
                "radial-gradient(circle, rgba(255, 236, 196, 0.7) 0%, rgba(255, 236, 196, 0.2) 45%, transparent 74%)",
              filter: "blur(70px)",
              opacity: bokehAOpacity,
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, 26, -18, 0], y: [0, -16, 12, 0], scale: [1, 1.04, 1] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 24,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }
            }
          />

          <motion.div
            className="absolute rounded-full"
            style={{
              right: "8%",
              bottom: "12%",
              width: "48vw",
              height: "48vw",
              maxWidth: "620px",
              maxHeight: "620px",
              background:
                "radial-gradient(circle, rgba(255, 224, 176, 0.65) 0%, rgba(255, 224, 176, 0.18) 42%, transparent 72%)",
              filter: "blur(76px)",
              opacity: bokehBOpacity,
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, -24, 14, 0], y: [0, 14, -10, 0], scale: [1, 0.97, 1] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 28,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }
            }
          />
        </motion.div>

        {/* ── Bottom-edge continuation glow (boosted 2×) ─────── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[28vh] pointer-events-none z-10"
          style={{ opacity: continuationGlowOpacity }}
        >
          <motion.div
            className="absolute inset-0"
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.85, 1, 0.85], y: [0, -4, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }
            }
            style={{
              background: [
                "radial-gradient(ellipse 65% 80% at 50% 115%,",
                "  rgba(255, 235, 200, 0.55) 0%,",
                "  rgba(255, 225, 175, 0.28) 25%,",
                "  rgba(255, 218, 160, 0.10) 45%,",
                "  transparent 68%",
                "),",
                "linear-gradient(to top,",
                "  rgba(248, 236, 218, 0.40) 0%,",
                "  rgba(248, 236, 218, 0.14) 28%,",
                "  transparent 65%",
                ")",
              ].join(""),
            }}
          />
        </motion.div>

        {/* ── Ornamental continuation motif ───────────────────── */}
        <motion.div
          className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 pointer-events-none"
          style={{ opacity: continuationCueOpacity, y: continuationCueY }}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -4, 0], opacity: [0.14, 0.20, 0.14] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 7,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                }
          }
          aria-hidden="true"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent via-[#D4C4A8]/50 to-transparent" />
          <div className="relative h-2.5 w-2.5 rotate-45 border border-[#D4C4A8]/55">
            <div className="absolute inset-[2px] border border-[#E8DBC8]/35" />
          </div>
          <div className="h-px w-10 bg-gradient-to-r from-transparent via-[#D4C4A8]/50 to-transparent" />
        </motion.div>

        {/* ── Camera drift — wraps all text layers ─────────────── */}
        <motion.div
          className="absolute inset-0 z-20"
          animate={prefersReducedMotion ? {} : cameraFloatAnimate}
          transition={prefersReducedMotion ? {} : cameraFloatTransition}
        >
          {/* ════════════════════════════════════════════════════════
              SCENE 1: Names — entrance animated, scroll dissolves
              ════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: namesOpacity, scale: namesScale }}
          >
            <div
              className="flex flex-col items-center text-center select-none"
              style={{ marginTop: "-4vh" }}
            >
              <div className="overflow-hidden py-2">
                <motion.h1
                  variants={titleVariants}
                  initial="hidden"
                  animate={animateState}
                  className="font-cormorant font-light tracking-[0.08em] text-[#2A1F14]/95 leading-none"
                  style={{ fontSize: "clamp(3.2rem, 9.5vw, 7rem)" }}
                >
                  Parvathy
                </motion.h1>
              </div>

              <div className="overflow-hidden py-1">
                <motion.div
                  variants={ampersandVariants}
                  initial="hidden"
                  animate={animateState}
                  className="my-4 leading-none"
                >
                  <span
                    className="font-great-vibes text-[#8B7355]/85"
                    style={{ fontSize: "clamp(2rem, 5.5vw, 3.8rem)" }}
                    aria-hidden="true"
                  >
                    &amp;
                  </span>
                </motion.div>
              </div>

              <div className="overflow-hidden py-2">
                <motion.h1
                  variants={partnerNameVariants}
                  initial="hidden"
                  animate={animateState}
                  className="font-cormorant font-light tracking-[0.08em] text-[#2A1F14]/95 leading-none"
                  style={{ fontSize: "clamp(3.2rem, 9.5vw, 7rem)" }}
                >
                  Harikrishnan
                </motion.h1>
              </div>

              <motion.div
                variants={subtitleVariants}
                initial="hidden"
                animate={animateState}
                className="my-12 flex items-center gap-4"
                aria-hidden="true"
              >
                <div className="w-14 h-px bg-[#8B7355]/30" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#8B7355]/35" />
                <div className="w-14 h-px bg-[#8B7355]/30" />
              </motion.div>

              <div className="overflow-hidden py-1">
                <motion.p
                  variants={subtitleVariants}
                  initial="hidden"
                  animate={animateState}
                  className="font-inter font-light uppercase tracking-[0.42em] text-[#6B5742]/85"
                  style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.78rem)" }}
                >
                  A new chapter begins
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════
              SCENE 2: Invitation — scroll enters, lines auto-stagger
              ════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: inviteOpacity, filter: inviteFilter }}
          >
            <div className="flex flex-col items-center text-center select-none gap-1">
              <div className="overflow-hidden py-1">
                <motion.p
                  variants={timedFadeUp(0)}
                  initial="hidden"
                  animate={scene2Active ? "visible" : "hidden"}
                  className="font-cormorant font-light italic text-[#2A1F14]/78 leading-relaxed"
                  style={{ fontSize: "clamp(1.35rem, 3vw, 2.1rem)" }}
                >
                  We&rsquo;re getting married,
                </motion.p>
              </div>
              <div className="overflow-hidden py-1">
                <motion.p
                  variants={timedFadeUp(0.34)}
                  initial="hidden"
                  animate={scene2Active ? "visible" : "hidden"}
                  className="font-cormorant font-light italic text-[#2A1F14]/78 leading-relaxed"
                  style={{ fontSize: "clamp(1.35rem, 3vw, 2.1rem)" }}
                >
                  and we&rsquo;d love you there.
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════
              SCENE 3: Day Reveal — scroll enters, details auto-cascade
              Date → Time → Venue with timed delays
              ════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: dayRevealOpacity }}
          >
            <div className="flex flex-col items-center text-center select-none gap-8">
              {/* Date — appears first */}
              <motion.p
                variants={timedFadeUp(0)}
                initial="hidden"
                animate={scene3Active ? "visible" : "hidden"}
                className="font-cormorant font-light tracking-[0.06em] text-[#2A1F14] leading-none"
                style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}
              >
                5 July 2026
              </motion.p>

              {/* Time — appears 0.6s after date */}
              <motion.p
                variants={timedFadeUp(0.6)}
                initial="hidden"
                animate={scene3Active ? "visible" : "hidden"}
                className="font-inter font-light uppercase tracking-[0.35em] text-[#6B5742]/60"
                style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.88rem)" }}
              >
                10:30 AM
              </motion.p>

              {/* Venue — appears 1.2s after date */}
              <motion.div
                variants={timedFadeUp(1.2)}
                initial="hidden"
                animate={scene3Active ? "visible" : "hidden"}
                className="flex flex-col items-center gap-1.5"
              >
                <p
                  className="font-cormorant font-light text-[#2A1F14]/88 leading-relaxed"
                  style={{ fontSize: "clamp(1.15rem, 2.6vw, 1.65rem)" }}
                >
                  Royal Convention Centre
                </p>
                <p
                  className="font-cormorant font-light text-[#6B5742]/75 leading-relaxed"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 1.4rem)" }}
                >
                  Pattambi
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════
              SCENE 4: Warm Closing — scroll enters, all parts auto-cascade
              Sentiment → Ornament → Details → Names
              ════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: closingOpacity }}
          >
            <div className="flex flex-col items-center text-center select-none gap-7">
              {/* Closing sentiment — appears first */}
              <motion.div
                variants={timedFadeUp(0)}
                initial="hidden"
                animate={scene4Active ? "visible" : "hidden"}
                className="flex flex-col items-center gap-1"
              >
                <p
                  className="font-cormorant font-light italic text-[#2A1F14]/80 leading-relaxed"
                  style={{ fontSize: "clamp(1.4rem, 3.2vw, 2.2rem)" }}
                >
                  A beautiful beginning,
                </p>
                <p
                  className="font-cormorant font-light italic text-[#2A1F14]/80 leading-relaxed"
                  style={{ fontSize: "clamp(1.4rem, 3.2vw, 2.2rem)" }}
                >
                  shared with the ones we love.
                </p>
              </motion.div>

              {/* Ornamental divider — 0.8s */}
              <motion.div
                variants={timedFade(0.8, 0.4)}
                initial="hidden"
                animate={scene4Active ? "visible" : "hidden"}
                className="flex items-center gap-4"
                aria-hidden="true"
              >
                <div className="w-10 h-px bg-[#8B7355]/30" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#8B7355]/30" />
                <div className="w-10 h-px bg-[#8B7355]/30" />
              </motion.div>

              {/* Date + venue — 1.4s */}
              <motion.div
                variants={timedFadeUp(1.4)}
                initial="hidden"
                animate={scene4Active ? "visible" : "hidden"}
                className="flex flex-col items-center gap-1.5"
              >
                <p
                  className="font-cormorant font-light tracking-[0.04em] text-[#2A1F14]/72"
                  style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.55rem)" }}
                >
                  5 July 2026
                </p>
                <p
                  className="font-inter font-light uppercase tracking-[0.3em] text-[#6B5742]/50"
                  style={{ fontSize: "clamp(0.55rem, 1.1vw, 0.7rem)" }}
                >
                  Royal Convention Centre, Pattambi
                </p>
              </motion.div>

              {/* Names — 2.0s */}
              <motion.p
                variants={timedFadeUp(2.0)}
                initial="hidden"
                animate={scene4Active ? "visible" : "hidden"}
                className="font-cormorant font-light tracking-[0.06em] text-[#2A1F14]/82"
                style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.8rem)" }}
              >
                Parvathy &amp; Harikrishnan
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
