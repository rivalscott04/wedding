
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Setup audio element
  useEffect(() => {
    // Cek apakah audio sudah ada
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "auto"; // Preload audio
      audio.src = "/music/BIW.mp3";
      audioRef.current = audio;

      // Fungsi handler untuk canplaythrough event
      const canPlayHandler = () => {
        setAudioError(false);
      };

      // Fungsi handler untuk error event
      const errorHandler = (e: Event) => {
        setAudioError(true);
      };

      // Set up event listeners
      audio.addEventListener("canplaythrough", canPlayHandler);
      audio.addEventListener("error", errorHandler);

      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("canplaythrough", canPlayHandler);
          audioRef.current.removeEventListener("error", errorHandler);
          audioRef.current.src = "";
        }
      };
    }
  }, []);

  // Attempt to play audio after user interaction
  useEffect(() => {
    if (hasInteracted && audioRef.current && !audioError) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          setIsPlaying(false);
        });
    }
  }, [hasInteracted, audioError]);

  // Show welcome dialog with music notification
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        setShowDialog(false);

        // Auto play music when dialog is closed
        if (!hasInteracted && !audioError && audioRef.current) {
          setHasInteracted(true);

          // Try to play audio
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              toast({
                title: "Memutar Lagu",
                description: "Selamat Mendengarkan",
              });
            })
            .catch(error => {
              // For mobile, show a toast explaining they need to tap
              if (isMobile) {
                toast({
                  title: "Ketuk tombol musik",
                  description: "Ketuk tombol di kanan atas untuk memutar musik",
                });
              }
            });
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showDialog, toast, isMobile, hasInteracted, audioError]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (audioError) {
      toast({
        title: "Kesalahan Audio",
        description: "Tidak dapat memuat file musik",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast({
          title: "Musik dijeda",
          description: "Ketuk tombol untuk memutar lagi",
        });
      } else {
        // Set hasInteracted first to trigger the useEffect
        setHasInteracted(true);

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              // Jika browser memblokir autoplay, tampilkan toast
              if (error.name === 'NotAllowedError') {
                toast({
                  title: "Interaksi diperlukan",
                  description: "Silakan klik lagi untuk memutar musik",
                });
              } else {
                toast({
                  title: "Kesalahan Audio",
                  description: "Tidak dapat memutar file musik",
                  variant: "destructive"
                });
              }
            });
        }
      }
    } catch (error) {
      // Handle error silently
    }
  };

  return (
    <>
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={(open) => {
          setShowDialog(open);

          // Auto play music when dialog is manually closed
          if (!open && !hasInteracted && !audioError && audioRef.current) {
            setHasInteracted(true);

            // Try to play audio
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
                toast({
                  title: "Memutar Lagu",
                  description: "Selamat Mendengarkan",
                });
              })
              .catch(error => {
                // Show a toast explaining they need to tap
                toast({
                  title: "Ketuk tombol musik",
                  description: "Ketuk tombol di kanan atas untuk memutar musik",
                });
              });
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Memutar Musik</DialogTitle>
              <DialogDescription className="text-center">
                {!audioError ? "Selamat Mendengarkan" : "Kesalahan Audio"}
              </DialogDescription>
              {!audioError ? (
                <p className="text-center mt-2 text-sm text-gray-500">
                  Musik akan otomatis diputar setelah dialog ini ditutup
                </p>
              ) : (
                <p className="text-center text-red-500 mt-2">
                  Tidak dapat memuat file musik
                </p>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[9999]"
      >
        <Button
          size={isMobile ? "sm" : "icon"}
          variant="outline"
          onClick={toggleMusic}
          className={`rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-white shadow-md border-retirement-muted/30 hover:bg-retirement-light cursor-pointer ${!isPlaying && isMobile && !audioError ? 'animate-pulse' : ''} ${audioError ? 'border-red-300' : ''}`}
          type="button"
          aria-label={isPlaying ? "Mute music" : "Unmute music"}
        >
          {isPlaying ? (
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-retirement" />
          ) : (
            <VolumeX className={`h-4 w-4 sm:h-5 sm:w-5 ${audioError ? 'text-red-500' : 'text-slate-500'}`} />
          )}
        </Button>
      </motion.div>
    </>
  );
}
