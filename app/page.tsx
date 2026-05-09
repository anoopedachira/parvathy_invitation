"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/hero/HeroSection";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { OpeningFrame } from "@/components/OpeningFrame";

export default function Home() {
  const [coverOpen, setCoverOpen] = useState(false);

  // Lock scroll while cover is showing
  useEffect(() => {
    if (!coverOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [coverOpen]);

  const handleOpen = useCallback(() => {
    setCoverOpen(true);
  }, []);

  return (
    <main>
      <SmoothScroll />

      {/* Hero is always mounted but entrance animations wait for cover to open */}
      <HeroSection revealed={coverOpen} />

      {/* Scroll indicator only appears after cover is dismissed */}
      {coverOpen && <ScrollIndicator />}

      {/* Opening cover — fixed overlay, exits with AnimatePresence */}
      <AnimatePresence>
        {!coverOpen && <OpeningFrame onOpen={handleOpen} />}
      </AnimatePresence>
    </main>
  );
}
