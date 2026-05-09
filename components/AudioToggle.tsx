"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for ambient music
    // Note: You'll need to add an audio file to public/
    audioRef.current = new Audio("/ambient-wedding.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log("Audio autoplay blocked by browser");
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={toggleAudio}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#F7F3EE]/80 backdrop-blur-sm border border-[#8B7355]/20 hover:bg-[#F7F3EE] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.6 }}
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-[#6B5742]" />
      ) : (
        <VolumeX className="w-5 h-5 text-[#6B5742]/60" />
      )}
    </motion.button>
  );
}