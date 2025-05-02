
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

interface Wish {
  name: string;
  message: string;
  timestamp: string;
}

export default function WeddingInvitation() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const handleWishSent = (newWish: Wish) => {
    setWishes(prevWishes => [newWish, ...prevWishes]);
  };

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
  };

  const { toast } = useToast();

  return (
    <div className="bg-white min-h-screen overflow-x-hidden w-full">
      {/* Music Toggle is now always visible, regardless of envelope state */}
      <MusicToggle />

      <HeroEnvelope onEnvelopeOpen={handleEnvelopeOpen} />

      {isEnvelopeOpen && (
        <>
          <Intro />
          <CountdownTimer targetDate="2025-05-31T08:00:00" />
          <EventDetails />
          <RSVPConfirm />

          <section className="py-12 sm:py-16 px-4 bg-[#F1F0FB]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-retirement-dark mb-2 sm:mb-3">Amplop Digital</h2>
                <div className="w-14 sm:w-16 h-1 bg-retirement-accent/50 mx-auto mb-3 sm:mb-4 rounded-full"></div>
                <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
                  Restu dan doa Anda adalah berkah bagi kami. Jika Anda ingin memberikan sesuatu, kami dengan penuh hormat akan menerimanya.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 max-w-xl mx-auto">
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
              </div>
            </div>
          </section>

          <section id="wishes" className="py-12 sm:py-16 px-4 bg-white">
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

          <footer className="py-6 sm:py-8 bg-[#F1F0FB] text-center text-2xs sm:text-xs text-slate-500 border-t border-retirement-muted/20">
            <div className="max-w-4xl mx-auto px-4">
              <p className="mb-1 font-serif text-sm sm:text-base text-retirement-dark">Rival & Syahrina</p>
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
