
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EnvelopeProps {
  onOpen: () => void;
}

export function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const handleOpenClick = () => {
    setIsOpening(true);
    
    // Add delay to allow animation to complete before callback
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-retirement-light">
      <AnimatePresence>
        {!isOpening ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md p-5 sm:p-8 mx-auto"
          >
            <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="w-14 sm:w-20 h-1 bg-retirement-accent/30 rounded-full"></div>
                <div className="mx-2 sm:mx-4 text-base sm:text-xl font-medium text-retirement">Undangan</div>
                <div className="w-14 sm:w-20 h-1 bg-retirement-accent/30 rounded-full"></div>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-retirement-dark mb-4 sm:mb-6">
                  Rival & Syahrina
                </h1>
                <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-slate-500">
                  Kami mengundang Bapak/Ibu/Saudara/i
                </div>
                <div className="py-2 sm:py-3 px-4 sm:px-8 mb-4 sm:mb-6 mx-auto text-base sm:text-lg font-medium border border-retirement-accent/30 inline-block rounded-md text-retirement-dark">
                  Yth. {guestName}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">
                  Untuk hadir dan memberikan doa restu
                </div>
              </div>

              <Button 
                onClick={handleOpenClick}
                className="w-full py-4 sm:py-6 text-white bg-retirement hover:bg-retirement-dark"
              >
                Buka Undangan
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: 0,
              scale: [1, 1.1, 0],
              rotateX: [0, -180, -180],
              y: [0, 0, -100]
            }}
            transition={{ 
              duration: 1.5,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
            className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-[4/3] bg-white rounded-lg shadow-lg"
          >
            {/* Envelope flap animation */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -180 }}
              transition={{ duration: 0.8 }}
              style={{ transformOrigin: "top" }}
              className="absolute inset-0 bg-white border border-slate-200 rounded-lg"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 text-retirement">
                  {/* You can add a heart icon or monogram here */}
                  RS
                </div>
              </div>
            </motion.div>
            
            {/* Loading spinner while transitioning */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-t-4 border-retirement rounded-full animate-spin"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
