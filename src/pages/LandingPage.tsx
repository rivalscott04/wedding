import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ArrowRight, Calendar, MapPin, Music, Gift, MessageCircle, Check } from "lucide-react";

// Component for animated sections
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state after initial render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      setError("Silakan masukkan nama Anda");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Redirect to invitation page with guest name as parameter
    const formattedName = guestName.trim().toLowerCase().replace(/\s+/g, '-');
    navigate(`/undangan?to=${encodeURIComponent(formattedName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-retirement-light to-white overflow-hidden">
      {/* Hero Section */}
      <section className="landing-hero relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Decorative elements with improved animations */}
        <motion.div
          className="absolute top-20 left-10 text-3xl opacity-30 hidden sm:block"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🕊️
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 text-3xl opacity-30 hidden sm:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🌿
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4 text-xl opacity-20 hidden sm:block"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/4 text-xl opacity-20 hidden sm:block"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          ✨
        </motion.div>

        {/* Main content */}
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left side - Text with staggered animations */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4">
                  <span className="font-almibar text-retirement-dark">Rival</span>
                  <span className="text-retirement">&</span>
                  <span className="font-almibar text-retirement-dark">Syahrina</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-6">
                  Kami akan menikah
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                  <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                    <Calendar className="h-5 w-5 text-retirement flex-shrink-0" />
                    <span className="text-slate-700 text-sm">Segera</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                    <MapPin className="h-5 w-5 text-retirement flex-shrink-0" />
                    <span className="text-slate-700 text-sm">Kotaraja</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mt-8 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-slate-600">
                  Kami mengundang Anda untuk berbagi kebahagiaan
                </p>
              </motion.div>
            </div>

            {/* Right side - Image with enhanced animation */}
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <div className="relative">
                <img
                  src="/images/pengantin.png"
                  alt="Pengantin"
                  className="w-full max-w-md mx-auto"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-retirement/10 to-transparent rounded-full"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator with improved visibility - moved to top */}
        <motion.div
          className="absolute top-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1, y: [0, 10, 0] } : { opacity: 0 }}
          transition={{
            opacity: { duration: 0.5, delay: 1.5 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center bg-white/70">
              <motion.div
                className="w-1.5 h-1.5 bg-retirement rounded-full mt-2"
                animate={{
                  y: [0, 15, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-retirement-dark mb-4">
              Informasi Acara
            </h2>
            <div className="w-24 h-1 bg-retirement/30 mx-auto mb-6"></div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Calendar className="h-10 w-10 text-retirement" />,
                title: "Waktu & Lokasi",
                description: "Akad dan resepsi di Desa Kotaraja"
              },
              {
                icon: <MessageCircle className="h-10 w-10 text-retirement" />,
                title: "Ucapan & Doa",
                description: "Kirim ucapan dan doa untuk kedua mempelai"
              },
              {
                icon: <Check className="h-10 w-10 text-retirement" />,
                title: "Konfirmasi",
                description: "Konfirmasi kehadiran Anda dengan mudah"
              }
            ].map((feature, index) => (
              <AnimatedSection
                key={index}
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 duration-300 border border-retirement/10"
                delay={index * 0.2}
              >
                <motion.div
                  className="bg-retirement-light/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--primary), 0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-retirement-dark mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-retirement-muted/20">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="mb-2">
              <span className="font-almibar text-lg text-retirement-dark">Rival</span>
              <span className="text-retirement mx-2">&</span>
              <span className="font-almibar text-lg text-retirement-dark">Syahrina</span>
            </p>
            <p className="text-sm text-slate-500 mb-4">Undangan Pernikahan</p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              Untuk momen spesial kami
            </div>
            <p className="text-xs text-gray-400 mt-2">© 2025</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
