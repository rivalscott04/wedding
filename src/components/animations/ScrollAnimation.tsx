import React from "react";
import { motion } from "framer-motion";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  type?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale" | "none";
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

export function ScrollAnimation({
  children,
  className = "",
  type = "fade",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2
}: ScrollAnimationProps) {
  // Animasi default
  let initial = {};
  let animate = {};

  // Konfigurasi animasi berdasarkan tipe
  switch (type) {
    case "fade":
      initial = { opacity: 0 };
      animate = { opacity: 1 };
      break;
    case "slide-up":
      initial = { opacity: 0, y: 20 };
      animate = { opacity: 1, y: 0 };
      break;
    case "slide-left":
      initial = { opacity: 0, x: -20 };
      animate = { opacity: 1, x: 0 };
      break;
    case "slide-right":
      initial = { opacity: 0, x: 20 };
      animate = { opacity: 1, x: 0 };
      break;
    case "scale":
      initial = { opacity: 0, scale: 0.95 };
      animate = { opacity: 1, scale: 1 };
      break;
    case "none":
      initial = {};
      animate = {};
      break;
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once, amount }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

// Komponen untuk animasi staggered (berurutan) untuk children
export function StaggeredAnimation({
  children,
  className = "",
  delay = 0.1,
  duration = 0.6,
  staggerDelay = 0.1,
  once = true,
  amount = 0.2
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <motion.div variants={itemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
