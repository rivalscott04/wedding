
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import confetti from "canvas-confetti";

export function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const handleOpenEnvelope = () => {
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsOpen(true);
  };

  return (
    <section className="py-12 md:py-20 px-4 flex flex-col items-center justify-center min-h-[80vh] bg-retirement-light/50 relative overflow-hidden">
      {/* Sasak Pattern Background */}
      <div className="absolute inset-0 opacity-10 z-0">
        <svg
          viewBox="0 0 1440 900"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            <pattern id="sasakPattern" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 0 L90 30 L60 60 L30 30 Z" fill="#911f1f" opacity="0.3" />
              <circle cx="60" cy="60" r="8" fill="#c8a961" opacity="0.5" />
              {/* Additional Sasak motifs */}
              <path d="M0 60 Q30 75 60 60 Q30 45 0 60" fill="none" stroke="#c8a961" strokeWidth="1" opacity="0.5" />
              <path d="M60 0 Q75 30 60 60 Q45 30 60 0" fill="none" stroke="#c8a961" strokeWidth="1" opacity="0.5" />
              <path d="M120 60 Q90 75 60 60 Q90 45 120 60" fill="none" stroke="#c8a961" strokeWidth="1" opacity="0.5" />
              <path d="M60 120 Q75 90 60 60 Q45 90 60 120" fill="none" stroke="#c8a961" strokeWidth="1" opacity="0.5" />
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
            {/* Envelope */}
            <Card className="relative bg-white rounded-xl shadow-lg border border-retirement-muted/30 overflow-hidden">
              {/* Envelope Flap - Top Triangle */}
              <motion.div
                className="absolute top-0 left-0 w-full h-24 bg-retirement-light/80"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  zIndex: 5,
                  backgroundImage: `linear-gradient(45deg, rgba(201, 173, 106, 0.2), rgba(145, 31, 31, 0.1))`,
                  borderBottom: "1px dashed rgba(145, 31, 31, 0.3)"
                }}
              />

              <CardContent className="pt-32 pb-8 px-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-1 bg-retirement-accent/30 rounded-full"></div>
                  <div className="mx-4 text-xl font-medium text-retirement">Undangan Digital</div>
                  <div className="w-20 h-1 bg-retirement-accent/30 rounded-full"></div>
                </div>

                <div className="text-center mb-8">
                  <h1 className="font-serif text-4xl font-bold text-retirement-dark mb-6" style={{ fontFamily: 'Almibar Pro' }}>
                    Rival & Syahrina
                  </h1>
                  <div className="mb-6 text-sm text-slate-500">
                    Kami mengundang Bapak/Ibu/Saudara/i
                  </div>
                  <div className="py-3 px-8 mb-2 mx-auto text-lg font-medium border border-retirement-accent/30 inline-block rounded-md text-retirement-dark">
                    Yth. {guestName}
                  </div>
                  <div className="text-xs italic text-slate-500 mb-3">
                    Mohon maaf apabila ada kesalahan penulisan nama dan gelar
                  </div>
                  <div className="text-sm text-slate-500 mb-8">
                    Untuk hadir dan memberikan doa restu
                  </div>
                </div>

                <Button
                  onClick={handleOpenEnvelope}
                  className="w-full py-6 text-white bg-retirement hover:bg-retirement-dark"
                >
                  Buka Undangan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10 text-center"
          >
            <div className="mb-4 text-retirement text-xs sm:text-sm tracking-widest">UNDANGAN PERNIKAHAN</div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-retirement-dark mb-6">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{ fontFamily: 'Almibar Pro' }}
              >
                Rival
              </motion.span>
              <span className="mx-2 md:mx-4">&</span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{ fontFamily: 'Almibar Pro' }}
              >
                Syahrina
              </motion.span>
            </h1>

            <div className="w-16 sm:w-20 h-1 bg-retirement-accent/50 mx-auto mb-6 rounded-full"></div>

            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto px-2">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
            </p>
            <p className="text-retirement-dark mt-3 italic text-xs sm:text-sm">— QS. Ar-Rum: 21</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
