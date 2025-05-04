
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCalendar } from "@/utils/calendar";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate?: string;
}

export function CountdownTimer({ targetDate = "2025-05-31T08:00:00" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current date and time from user's device
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeBlocks = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative py-16 sm:py-20 px-4 overflow-hidden">
      {/* Enhanced Sasak Pattern Background */}
      <div
        className="absolute inset-0 bg-[url('/images/sasak-pattern.svg')]
        bg-repeat opacity-10 pointer-events-none"
        style={{
          backgroundSize: '100px 100px',
          backgroundImage: `linear-gradient(45deg,
            rgba(79, 111, 160, 0.05),
            rgba(126, 111, 158, 0.05)
          ), url('/images/sasak-pattern.svg')`
        }}
      />

      {/* Enhanced Top Border Pattern */}
      <div
        className="absolute top-0 left-0 right-0 h-12 bg-[url('/images/sasak-pattern.svg')]
        bg-repeat-x opacity-20 pointer-events-none transform rotate-180"
        style={{
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
        }}
      />

      {/* Enhanced Bottom Border Pattern */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 bg-[url('/images/sasak-pattern.svg')]
        bg-repeat-x opacity-20 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)'
        }}
      />

      {/* Animated Doves */}
      <motion.div
        initial={{ x: -100, y: 50, opacity: 0 }}
        animate={{
          x: [null, 0, 100],
          y: [null, 0, -50],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="absolute top-1/4 left-0 pointer-events-none"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-retirement-accent/30">
          <path d="M21.946 9.372a1.5 1.5 0 0 0-.484-.667L21 6.5s-4 2-8 2-8-2-8-2l-.446 2.205a1.5 1.5 0 0 0-.484.667L8 12l-3.93 2.621a1.5 1.5 0 0 0 .484.667L5 17.5s4-2 8-2 8 2 8 2l.446-2.205a1.5 1.5 0 0 0 .484-.667L18 12l3.946-2.628zM12 13.5c-1.933 0-3.5-2.09-3.5-4.667S10.067 4.167 12 4.167s3.5 2.09 3.5 4.666S13.933 13.5 12 13.5z" fill="currentColor"/>
        </svg>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="text-center mb-10 sm:mb-12">
          <motion.h3
            variants={itemVariants}
            className="font-serif text-3xl sm:text-4xl text-retirement-dark mb-4"
          >
            Save the Date
          </motion.h3>
          <motion.div
            variants={itemVariants}
            className="w-20 h-1 bg-retirement-accent/50 mx-auto mb-6"
          />
          <motion.p
            variants={itemVariants}
            className="text-slate-600 mb-4"
          >
            31 Mei 2025 - 4 Dzulhijjah 1446 H
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              size="sm"
              className="border-retirement text-retirement hover:bg-retirement hover:text-white"
              onClick={() => addToCalendar({
                title: "Pernikahan Rival & Syahrina",
                description: "Akad Nikah dan Resepsi Pernikahan",
                startDate: targetDate,
                location: "Jakarta, Indonesia"
              })}
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Tambahkan ke Kalender
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto"
        >
          {timeBlocks.map(({ label, value }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="text-center"
            >
              <motion.div
                key={`${label}-${value}`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-retirement-light/70 border border-retirement-muted/30 rounded-xl p-3 sm:p-6 mb-2 shadow-sm"
              >
                <span className="font-serif text-2xl sm:text-4xl md:text-5xl text-retirement-dark">
                  {String(value).padStart(2, '0')}
                </span>
              </motion.div>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
