"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
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

export function HeroSection({ revealed = true }: { revealed?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();

  // Animation state: entrance animations fire only after cover opens
  const animateState = revealed ? "visible" : "hidden";

  // Canvas: 1200vh → max reachable = (1200-100)/1200 = 0.917
  // All animations complete by 0.89
  const scrollYProgress = useTransform(scrollY, (y) => {
    if (!containerRef.current) return 0;
    return Math.min(y / containerRef.current.offsetHeight, 1);
  });

  const noMove = prefersReducedMotion;

  // ── Background drift ──────────────────────────────────────────
  const bgY = useTransform(
    scrollYProgress, [0, 1],
    noMove ? ["0%", "0%"] : ["0%", "-4%"]
  );

  // ── Scroll-driven lighting temperature shift ──────────────────
  // Morning cool → golden warm as the experience unfolds
  const lightWarmth = useTransform(scrollYProgress, [0, 0.5, 0.9], [0, 0.3, 0.7]);
  const goldenBloomOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 0.35]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1 — Names (0 → 0.08)
  // ═══════════════════════════════════════════════════════════════
  const namesY = useTransform(
    scrollYProgress, [0, 0.08],
    noMove ? ["0%", "0%"] : ["0%", "-10%"]
  );
  const namesOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const namesScale = useTransform(
    scrollYProgress, [0, 0.08],
    noMove ? [1, 1] : [1, 0.972]
  );

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2 — Invitation (reveal 0.11→0.19, hold, dissolve 0.23→0.30)
  // ═══════════════════════════════════════════════════════════════
  const inviteY = useTransform(
    scrollYProgress, [0.11, 0.16],
    noMove ? ["0px", "0px"] : ["22px", "0px"]
  );
  const inviteOpacity = useTransform(
    scrollYProgress, [0.11, 0.16, 0.24, 0.32], [0, 1, 1, 0]
  );
  const inviteFilter = useTransform(
    scrollYProgress, [0.11, 0.16], ["blur(10px)", "blur(0px)"]
  );

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3 — Day Reveal (date 0.34→0.41, time 0.43→0.48,
  //           venue 0.50→0.55, dissolve 0.57→0.63)
  // ═══════════════════════════════════════════════════════════════
  const dayRevealY = useTransform(
    scrollYProgress, [0.34, 0.55],
    noMove ? ["0px", "0px"] : ["0px", "-12px"]
  );
  const dayRevealOpacity = useTransform(
    scrollYProgress, [0.34, 0.41, 0.57, 0.63], [0, 1, 1, 0]
  );

  const dateOpacity = useTransform(scrollYProgress, [0.34, 0.41], [0, 1]);
  const dateFilter = useTransform(
    scrollYProgress, [0.34, 0.41], ["blur(8px)", "blur(0px)"]
  );
  const dateY = useTransform(
    scrollYProgress, [0.34, 0.41],
    noMove ? ["0px", "0px"] : ["18px", "0px"]
  );

  const timeOpacity = useTransform(scrollYProgress, [0.43, 0.48], [0, 1]);
  const timeFilter = useTransform(
    scrollYProgress, [0.43, 0.48], ["blur(4px)", "blur(0px)"]
  );
  const timeY = useTransform(
    scrollYProgress, [0.43, 0.48],
    noMove ? ["0px", "0px"] : ["12px", "0px"]
  );

  const venueOpacity = useTransform(scrollYProgress, [0.50, 0.55], [0, 1]);
  const venueFilter = useTransform(
    scrollYProgress, [0.50, 0.55], ["blur(4px)", "blur(0px)"]
  );
  const venueY = useTransform(
    scrollYProgress, [0.50, 0.55],
    noMove ? ["0px", "0px"] : ["12px", "0px"]
  );

  // ═══════════════════════════════════════════════════════════════
  // SCENE 4 — Warm Closing (0.67→0.74 sentiment, 0.75→0.79 ornament,
  //           0.80→0.84 date+venue, 0.84→0.88 names)
  // ═══════════════════════════════════════════════════════════════
  const closingY = useTransform(
    scrollYProgress, [0.67, 0.89],
    noMove ? ["0px", "0px"] : ["0px", "-8px"]
  );

  const closingMainOpacity = useTransform(scrollYProgress, [0.67, 0.74], [0, 1]);
  const closingMainFilter = useTransform(
    scrollYProgress, [0.67, 0.74], ["blur(8px)", "blur(0px)"]
  );
  const closingMainY = useTransform(
    scrollYProgress, [0.67, 0.74],
    noMove ? ["0px", "0px"] : ["18px", "0px"]
  );

  const closingOrnamentOpacity = useTransform(scrollYProgress, [0.75, 0.79], [0, 0.4]);

  const closingDetailsOpacity = useTransform(scrollYProgress, [0.80, 0.84], [0, 1]);
  const closingDetailsFilter = useTransform(
    scrollYProgress, [0.80, 0.84], ["blur(4px)", "blur(0px)"]
  );
  const closingDetailsY = useTransform(
    scrollYProgress, [0.80, 0.84],
    noMove ? ["0px", "0px"] : ["10px", "0px"]
  );

  const closingNamesOpacity = useTransform(scrollYProgress, [0.84, 0.88], [0, 1]);
  const closingNamesFilter = useTransform(
    scrollYProgress, [0.84, 0.88], ["blur(4px)", "blur(0px)"]
  );
  const closingNamesY = useTransform(
    scrollYProgress, [0.84, 0.88],
    noMove ? ["0px", "0px"] : ["8px", "0px"]
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[1200vh]"
      aria-label="Wedding invitation"
    >
      {/* ── Sticky viewport ──────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Atmosphere layers ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-0"
          style={{ y: bgY }}
          variants={atmosphereVariants}
          initial="hidden"
          animate={animateState}
        >
          {/* Base warm paper */}
          <div className="absolute inset-0 bg-[#F7F3EE]" />

          {/* Tonal depth — asymmetric warmth + vertical drift */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse 80% 65% at 35% 35%,",
                "  rgba(255, 250, 240, 0.65) 0%,",
                "  transparent 55%",
                "),",
                "radial-gradient(ellipse 55% 50% at 85% 75%,",
                "  rgba(238, 228, 212, 0.25) 0%,",
                "  transparent 50%",
                "),",
                "linear-gradient(to bottom,",
                "  rgba(255, 252, 245, 0.0) 0%,",
                "  rgba(248, 240, 225, 0.12) 50%,",
                "  rgba(242, 232, 215, 0.2) 100%",
                ")",
              ].join(""),
            }}
          />

          {/* Dynamic spotlight — follows scroll progress */}
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

          {/* Secondary light drift — subtle counter-movement */}
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

          {/* Additional depth layer — subtle texture variation */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              background: [
                "radial-gradient(ellipse 60% 40% at 15% 25%,",
                "  rgba(250, 245, 235, 0.4) 0%,",
                "  transparent 45%",
                "),",
                "radial-gradient(ellipse 45% 35% at 75% 85%,",
                "  rgba(245, 235, 220, 0.3) 0%,",
                "  transparent 40%",
                ")",
              ].join(""),
            }}
          />

          {/* Primary morning light — stronger, asymmetric from top-left */}
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

          {/* Secondary warm fill — lower right, out of phase */}
          <motion.div
            className="absolute inset-0"
            animate={prefersReducedMotion ? {} : warmGlowAnimate}
            transition={prefersReducedMotion ? {} : warmGlowTransition}
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 88% 95%, rgba(255, 218, 140, 0.15) 0%, transparent 55%)",
            }}
          />

          {/* Scroll-driven warmth — light temperature evolves as journey progresses */}
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

          {/* Golden hour bloom — intensifies in final scenes */}
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

          {/* Paper grain — tactile depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: GRAIN_URI,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
              opacity: 0.052,
              mixBlendMode: "multiply",
            }}
          />

          {/* Cinematic vignette — asymmetric, softer right fade */}
          <div
            className="absolute inset-0 pointer-events-none"
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
        </motion.div>

        {/* Foreground light diffusion — top halo */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 65% 30% at 50% -1%, rgba(255, 248, 228, 0.45) 0%, transparent 72%)",
          }}
        />

        {/* ── Camera drift — wraps all text layers ─────────────── */}
        <motion.div
          className="absolute inset-0 z-20"
          animate={prefersReducedMotion ? {} : cameraFloatAnimate}
          transition={prefersReducedMotion ? {} : cameraFloatTransition}
        >
          {/* ── Scene 1: Names ──────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ y: namesY, opacity: namesOpacity, scale: namesScale }}
          >
            <div
              className="flex flex-col items-center text-center select-none"
              style={{ marginTop: "-4vh" }}
            >
              <motion.h1
                variants={titleVariants}
                initial="hidden"
                animate={animateState}
                className="font-cormorant font-light tracking-[0.08em] text-[#2A1F14]/95 leading-none"
                style={{ fontSize: "clamp(3.2rem, 9.5vw, 7rem)" }}
              >
                Parvathy
              </motion.h1>

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

              <motion.h1
                variants={partnerNameVariants}
                initial="hidden"
                animate={animateState}
                className="font-cormorant font-light tracking-[0.08em] text-[#2A1F14]/95 leading-none"
                style={{ fontSize: "clamp(3.2rem, 9.5vw, 7rem)" }}
              >
                Harikrishnan
              </motion.h1>

              {/* Ornamental rule */}
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
          </motion.div>

          {/* ── Scene 2: Invitation ─────────────────────────────── */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              y: inviteY,
              opacity: inviteOpacity,
              filter: inviteFilter,
            }}
          >
            <div className="flex flex-col items-center text-center select-none gap-1">
              <p
                className="font-cormorant font-light italic text-[#2A1F14]/78 leading-relaxed"
                style={{ fontSize: "clamp(1.35rem, 3vw, 2.1rem)" }}
              >
                We&rsquo;re getting married —
              </p>
              <p
                className="font-cormorant font-light italic text-[#2A1F14]/78 leading-relaxed"
                style={{ fontSize: "clamp(1.35rem, 3vw, 2.1rem)" }}
              >
                and we&rsquo;d love you there.
              </p>
            </div>
          </motion.div>

          {/* ── Scene 3: Day Reveal ─────────────────────────────── */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ y: dayRevealY, opacity: dayRevealOpacity }}
          >
            <div className="flex flex-col items-center text-center select-none gap-8">
              <motion.p
                className="font-cormorant font-light tracking-[0.06em] text-[#2A1F14] leading-none"
                style={{
                  fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
                  y: dateY,
                  opacity: dateOpacity,
                  filter: dateFilter,
                }}
              >
                5 July 2026
              </motion.p>

              <motion.p
                className="font-inter font-light uppercase tracking-[0.35em] text-[#6B5742]/60"
                style={{
                  fontSize: "clamp(0.7rem, 1.5vw, 0.88rem)",
                  y: timeY,
                  opacity: timeOpacity,
                  filter: timeFilter,
                }}
              >
                10:30 AM
              </motion.p>

              <motion.div
                className="flex flex-col items-center gap-1.5"
                style={{
                  y: venueY,
                  opacity: venueOpacity,
                  filter: venueFilter,
                }}
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

          {/* ── Scene 4: Warm Closing — everything comes together ── */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ y: closingY }}
          >
            <div className="flex flex-col items-center text-center select-none gap-7">
              {/* Closing sentiment */}
              <motion.div
                className="flex flex-col items-center gap-1"
                style={{
                  y: closingMainY,
                  opacity: closingMainOpacity,
                  filter: closingMainFilter,
                }}
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

              {/* Ornamental divider */}
              <motion.div
                className="flex items-center gap-4"
                style={{ opacity: closingOrnamentOpacity }}
                aria-hidden="true"
              >
                <div className="w-10 h-px bg-[#8B7355]/30" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#8B7355]/30" />
                <div className="w-10 h-px bg-[#8B7355]/30" />
              </motion.div>

              {/* Date + venue — elegant summation */}
              <motion.div
                className="flex flex-col items-center gap-1.5"
                style={{
                  y: closingDetailsY,
                  opacity: closingDetailsOpacity,
                  filter: closingDetailsFilter,
                }}
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

              {/* Names — warm, present, final anchor */}
              <motion.p
                className="font-cormorant font-light tracking-[0.06em] text-[#2A1F14]/82"
                style={{
                  fontSize: "clamp(1.2rem, 2.8vw, 1.8rem)",
                  y: closingNamesY,
                  opacity: closingNamesOpacity,
                  filter: closingNamesFilter,
                }}
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
