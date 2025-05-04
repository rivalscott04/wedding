import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollAnimation } from "@/components/animations/ScrollAnimation";

interface FrameWrapperProps {
  children: ReactNode;
  className?: string;
  animationDelay?: number;
}

export function FrameWrapper({ children, className, animationDelay = 0 }: FrameWrapperProps) {
  return (
    <div className={cn("relative px-4 py-6 sm:py-8 md:py-10", className)}>
      {/* Top Left Corner */}
      <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L100 0L100 20C100 20 80 20 60 20C40 20 20 40 20 60C20 80 20 100 20 100L0 100L0 0Z" fill="none" stroke="#4F6FA0" strokeWidth="2" />
          <path d="M0 0L40 0C40 0 60 0 60 20C60 40 40 40 20 40C0 40 0 60 0 60L0 0Z" fill="none" stroke="#7E6F9E" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0L0 0L0 20C0 20 20 20 40 20C60 20 80 40 80 60C80 80 80 100 80 100L100 100L100 0Z" fill="none" stroke="#4F6FA0" strokeWidth="2" />
          <path d="M100 0L60 0C60 0 40 0 40 20C40 40 60 40 80 40C100 40 100 60 100 60L100 0Z" fill="none" stroke="#7E6F9E" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100L100 100L100 80C100 80 80 80 60 80C40 80 20 60 20 40C20 20 20 0 20 0L0 0L0 100Z" fill="none" stroke="#4F6FA0" strokeWidth="2" />
          <path d="M0 100L40 100C40 100 60 100 60 80C60 60 40 60 20 60C0 60 0 40 0 40L0 100Z" fill="none" stroke="#7E6F9E" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 100L0 100L0 80C0 80 20 80 40 80C60 80 80 60 80 40C80 20 80 0 80 0L100 0L100 100Z" fill="none" stroke="#4F6FA0" strokeWidth="2" />
          <path d="M100 100L60 100C60 100 40 100 40 80C40 60 60 60 80 60C100 60 100 40 100 40L100 100Z" fill="none" stroke="#7E6F9E" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>

      {/* Content */}
      <ScrollAnimation
        type="slide-up"
        duration={0.7}
        delay={animationDelay}
        className="py-2 sm:py-4 relative"
      >
        {children}
      </ScrollAnimation>

      {/* Side Borders */}
      <div className="absolute top-16 sm:top-20 md:top-24 bottom-16 sm:bottom-20 md:bottom-24 left-0 w-2 flex flex-col justify-center">
        <div className="w-1 h-1/2 border-l-2 border-[#4F6FA0]"></div>
        <div className="w-1 h-1/2 border-l border-[#7E6F9E] opacity-70"></div>
      </div>
      <div className="absolute top-16 sm:top-20 md:top-24 bottom-16 sm:bottom-20 md:bottom-24 right-0 w-2 flex flex-col justify-center">
        <div className="w-1 h-1/2 border-r-2 border-[#4F6FA0]"></div>
        <div className="w-1 h-1/2 border-r border-[#7E6F9E] opacity-70"></div>
      </div>

      {/* Top and Bottom Borders */}
      <div className="absolute left-16 sm:left-20 md:left-24 right-16 sm:right-20 md:right-24 top-0 h-2 flex justify-center">
        <div className="h-1 w-1/2 border-t-2 border-[#4F6FA0]"></div>
        <div className="h-1 w-1/2 border-t border-[#7E6F9E] opacity-70"></div>
      </div>
      <div className="absolute left-16 sm:left-20 md:left-24 right-16 sm:right-20 md:right-24 bottom-0 h-2 flex justify-center">
        <div className="h-1 w-1/2 border-b-2 border-[#4F6FA0]"></div>
        <div className="h-1 w-1/2 border-b border-[#7E6F9E] opacity-70"></div>
      </div>
    </div>
  );
}