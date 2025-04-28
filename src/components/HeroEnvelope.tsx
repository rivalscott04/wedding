
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import confetti from "canvas-confetti";

interface HeroEnvelopeProps {
  onEnvelopeOpen: () => void;
}

export function HeroEnvelope({ onEnvelopeOpen }: HeroEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const handleOpenEnvelope = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F6FA0', '#E5DEFF', '#FFFFFF']
    });
    
    setIsOpen(true);
    onEnvelopeOpen();
  };

  return (
    <section className="py-8 md:py-12 lg:py-16 px-4 flex flex-col items-center justify-center min-h-[80vh] bg-[#F6F6F7] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 z-0">
        <svg
          viewBox="0 0 1440 900"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            <pattern id="sasakPattern" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 0 L90 30 L60 60 L30 30 Z" fill="#4F6FA0" opacity="0.3" />
              <circle cx="60" cy="60" r="8" fill="#7E6F9E" opacity="0.5" />
              <path d="M0 60 Q30 75 60 60 Q30 45 0 60" fill="none" stroke="#7E6F9E" strokeWidth="1" opacity="0.5" />
              <path d="M60 0 Q75 30 60 60 Q45 30 60 0" fill="none" stroke="#7E6F9E" strokeWidth="1" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sasakPattern)" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md z-10"
          >
            <div className="relative bg-white rounded-xl shadow-lg border border-[#E5DEFF] overflow-hidden p-6 sm:p-8">
              <motion.div 
                className="absolute top-0 left-0 w-full h-24 bg-[#F6F6F7]"
                style={{ 
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  zIndex: 5,
                  backgroundImage: `linear-gradient(45deg, rgba(126, 111, 158, 0.1), rgba(79, 111, 160, 0.05))`,
                  borderBottom: "1px dashed rgba(79, 111, 160, 0.2)"
                }}
              />
              
              <div className="pt-16 sm:pt-20 text-center">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="w-16 sm:w-20 h-1 bg-[#E5DEFF] rounded-full"></div>
                  <div className="mx-2 sm:mx-4 text-base sm:text-xl font-medium text-[#4F6FA0] font-serif">Undangan</div>
                  <div className="w-16 sm:w-20 h-1 bg-[#E5DEFF] rounded-full"></div>
                </div>
                
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4F6FA0] mb-4 sm:mb-6 flex flex-col items-center">
                  <span className="block text-center">Rival</span>
                  <span className="block my-1 sm:my-2 text-2xl sm:text-3xl text-center">&</span>
                  <span className="block text-center">Syahrina</span>
                </h1>
                
                <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-[#7E6F9E]">
                  Kami mengundang Bapak/Ibu/Saudara/i
                </div>
                <div className="py-2 sm:py-3 px-4 sm:px-8 mb-4 sm:mb-6 mx-auto text-sm sm:text-lg font-medium border border-[#E5DEFF] inline-block rounded-md text-[#4F6FA0] font-serif">
                  Yth. {guestName}
                </div>
                <div className="text-xs sm:text-sm text-[#7E6F9E] mb-6 sm:mb-8">
                  Untuk hadir dan memberikan doa restu
                </div>

                <Button 
                  onClick={handleOpenEnvelope}
                  className="px-4 sm:px-6 py-4 sm:py-6 text-white bg-[#4F6FA0] hover:bg-[#3D5A8F] transition-colors font-serif"
                >
                  <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Buka Undangan
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10 text-center max-w-full w-full px-4"
          >
            <div className="mb-3 md:mb-4 text-xs sm:text-sm tracking-widest text-[#4F6FA0] font-serif">
              UNDANGAN PERNIKAHAN
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#4F6FA0] mb-4 md:mb-6 flex flex-col items-center">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="block text-center"
              >
                Rival
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="block my-1 sm:my-2 text-2xl sm:text-3xl md:text-4xl text-center"
              >
                &
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="block text-center"
              >
                Syahrina
              </motion.span>
            </h1>
            
            <div className="w-12 sm:w-16 h-1 bg-[#E5DEFF] mx-auto mb-4 sm:mb-6 rounded-full"></div>
            
            <p className="text-[#7E6F9E] text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-2 font-serif">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
            </p>
            <p className="text-[#4F6FA0] mt-2 md:mt-3 italic text-xs sm:text-sm font-serif">
              — QS. Ar-Rum: 21
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
