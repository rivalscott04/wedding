
import React, { useState } from "react";
import { HeroEnvelope } from "@/components/HeroEnvelope";
import { Intro } from "@/components/Intro";
import { CountdownTimer } from "@/components/CountdownTimer";
import { EventDetails } from "@/components/EventDetails";
import { RSVPConfirm } from "@/components/RSVPConfirm";
import { WishesForm } from "@/components/WishesForm";
import { WishesList } from "@/components/WishesList";
import { MusicToggle } from "@/components/MusicToggle";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Copy, Heart } from "lucide-react";
import { StaggeredAnimation } from "@/components/animations/ScrollAnimation";
import { FloatingAnimation, FloatingPathAnimation } from "@/components/animations/FloatingAnimation";
import { FrameWrapper } from "@/components/FrameWrapper";

interface Wish {
  name: string;
  message: string;
  timestamp: string;
}

export default function WeddingInvitation() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const handleWishSent = (newWish: Wish) => {
    console.log("New wish received in WeddingInvitation:", newWish);
    setWishes(prevWishes => {
      const updatedWishes = [newWish, ...prevWishes];
      console.log("Updated wishes state:", updatedWishes);
      return updatedWishes;
    });
  };

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
  };

  const { toast } = useToast();

  return (
    <div className="bg-white min-h-screen overflow-x-hidden w-full relative">
      {/* Elemen dekoratif dengan animasi floating */}
      <FloatingPathAnimation
        className="absolute top-[15%] left-[5%] z-10 hidden sm:block pointer-events-none"
        path="circle"
        size={30}
        duration={12}
      >
        <div className="text-3xl opacity-30">🕊️</div>
      </FloatingPathAnimation>

      <FloatingPathAnimation
        className="absolute top-[40%] right-[5%] z-10 hidden sm:block pointer-events-none"
        path="wave"
        size={25}
        duration={15}
        delay={2}
      >
        <div className="text-2xl opacity-30">🌿</div>
      </FloatingPathAnimation>

      <FloatingAnimation
        className="absolute bottom-[20%] left-[10%] z-10 hidden sm:block pointer-events-none"
        yOffset={15}
        duration={6}
      >
        <div className="text-2xl opacity-20">✨</div>
      </FloatingAnimation>

      <FloatingAnimation
        className="absolute bottom-[30%] right-[15%] z-10 hidden sm:block pointer-events-none"
        yOffset={20}
        duration={8}
        delay={1}
      >
        <div className="text-2xl opacity-20">✨</div>
      </FloatingAnimation>

      {/* Music Toggle is now always visible, regardless of envelope state */}
      <MusicToggle />

      <HeroEnvelope onEnvelopeOpen={handleEnvelopeOpen} />

      {isEnvelopeOpen && (
        <>
          <FrameWrapper className="bg-white" animationDelay={0.1}>
            <Intro />
          </FrameWrapper>

          <FrameWrapper className="bg-[#F6F6F7]" animationDelay={0.2}>
            <CountdownTimer targetDate="2025-05-31T08:00:00" />
          </FrameWrapper>

          <FrameWrapper className="bg-white" animationDelay={0.3}>
            <EventDetails />
          </FrameWrapper>

          <FrameWrapper className="bg-[#F6F6F7]" animationDelay={0.4}>
            <RSVPConfirm />
          </FrameWrapper>

          <FrameWrapper className="bg-[#F1F0FB]" animationDelay={0.5}>
            <section className="py-6 sm:py-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-retirement-dark mb-2 sm:mb-3">Amplop Digital</h2>
                  <div className="w-14 sm:w-16 h-1 bg-retirement-accent/50 mx-auto mb-3 sm:mb-4 rounded-full"></div>
                  <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
                    Restu dan doa Anda adalah berkah bagi kami. Jika Anda ingin memberikan sesuatu, kami dengan penuh hormat akan menerimanya.
                  </p>
                </div>

                <StaggeredAnimation className="grid gap-4 md:grid-cols-2 max-w-xl mx-auto" staggerDelay={0.15}>
                  {/* BSI Card */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-retirement-muted/20">
                    <div className="flex items-center justify-center h-10 mb-3">
                      <img src="/images/bsi-logo.svg" alt="BSI" className="h-24" />
                    </div>
                    <p className="text-center text-xs text-slate-600 mb-2">a.n Rival Biasrori</p>
                    <div className="flex items-center justify-center gap-2 bg-retirement-light/10 rounded-md px-3 py-1.5 border border-retirement-muted/30">
                      <p className="font-mono text-retirement-dark text-sm">7205700867</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("7205700867");
                          toast({
                            title: "Berhasil disalin",
                            description: "Nomor rekening telah disalin ke clipboard",
                          });
                        }}
                        className="p-1 hover:bg-retirement-light/20 rounded-md transition-colors"
                      >
                        <Copy className="h-3 w-3 text-retirement" />
                      </button>
                    </div>
                  </div>

                  {/* Bank NTB Card */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-retirement-muted/20">
                    <div className="flex items-center justify-center h-10 mb-3">
                      <img src="/images/ntb-logo.svg" alt="Bank NTB" className="h-16" />
                    </div>
                    <p className="text-center text-xs text-slate-600 mb-2">a.n Syahrina Ulya Ramadhani</p>
                    <div className="flex items-center justify-center gap-2 bg-retirement-light/10 rounded-md px-3 py-1.5 border border-retirement-muted/30">
                      <p className="font-mono text-retirement-dark text-sm">0010205703314</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("0010205703314");
                          toast({
                            title: "Berhasil disalin",
                            description: "Nomor rekening telah disalin ke clipboard",
                          });
                        }}
                        className="p-1 hover:bg-retirement-light/20 rounded-md transition-colors"
                      >
                        <Copy className="h-3 w-3 text-retirement" />
                      </button>
                    </div>
                  </div>
                </StaggeredAnimation>
              </div>
            </section>
          </FrameWrapper>

          <FrameWrapper className="bg-white" animationDelay={0.6}>
            <section id="wishes" className="py-6 sm:py-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-retirement-dark mb-2 sm:mb-3">Ucapan & Doa</h2>
                  <div className="w-14 sm:w-16 h-1 bg-retirement-accent/50 mx-auto mb-3 sm:mb-4 rounded-full"></div>
                  <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
                    Berikan ucapan dan doa restu untuk kedua mempelai
                  </p>
                </div>

                <WishesForm onWishSent={handleWishSent} />
                <WishesList wishes={wishes} />
              </div>
            </section>
          </FrameWrapper>

          <footer className="py-6 sm:py-8 bg-[#F1F0FB] text-center text-2xs sm:text-xs text-slate-500 border-t border-retirement-muted/20">
            <div className="max-w-4xl mx-auto px-4">
              <p className="mb-1 font-serif text-sm sm:text-base text-retirement-dark">Rival & Syahrina</p>
              <p className="mb-2 sm:mb-3">15 Juni 2024</p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                Made with <Heart className="h-4 w-4 text-[#ea384c] fill-[#ea384c]" /> by Couple
              </div>
              <p>© 2025 Digital Wedding Invitation</p>
            </div>
          </footer>
        </>
      )}

      <Toaster />
    </div>
  );
}
