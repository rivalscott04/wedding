import React from "react";
import { motion } from "framer-motion";

interface FloatingAnimationProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  xOffset?: number;
  opacityMin?: number;
  opacityMax?: number;
}

export function FloatingAnimation({
  children,
  className = "",
  duration = 4,
  delay = 0,
  yOffset = 10,
  xOffset = 0,
  opacityMin = 0.7,
  opacityMax = 1
}: FloatingAnimationProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: xOffset === 0 ? [-yOffset, yOffset, -yOffset] : undefined,
        x: yOffset === 0 ? [-xOffset, xOffset, -xOffset] : undefined,
        opacity: [opacityMin, opacityMax, opacityMin]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}

// Komponen untuk animasi floating dengan path yang lebih kompleks
export function FloatingPathAnimation({
  children,
  className = "",
  duration = 8,
  delay = 0,
  path = "circle", // "circle", "figure8", "wave"
  size = 20,
  opacityMin = 0.7,
  opacityMax = 1
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  path?: "circle" | "figure8" | "wave";
  size?: number;
  opacityMin?: number;
  opacityMax?: number;
}) {
  let animationPath;
  
  switch (path) {
    case "circle":
      animationPath = {
        x: [0, size, 0, -size, 0],
        y: [-size, 0, size, 0, -size]
      };
      break;
    case "figure8":
      animationPath = {
        x: [0, size, 0, -size, 0],
        y: [-size, size, -size, size, -size]
      };
      break;
    case "wave":
      animationPath = {
        x: [-size, 0, size, 0, -size],
        y: [0, -size, 0, -size, 0]
      };
      break;
    default:
      animationPath = {
        x: [0, size, 0, -size, 0],
        y: [-size, 0, size, 0, -size]
      };
  }
  
  return (
    <motion.div
      className={className}
      animate={{
        ...animationPath,
        opacity: [opacityMin, opacityMax, opacityMin, opacityMax, opacityMin]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}
