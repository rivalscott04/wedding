import React from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

export function Intro() {
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  return (
    <section className="py-12 md:py-20 px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-retirement-dark mb-6 sm:mb-8 px-4">
          Bismillahirrahmanirrahim
        </h2>

        <p className="text-slate-700 mb-4 sm:mb-6 leading-relaxed text-base sm:text-lg font-semibold px-4">
          Assalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        <p className="text-slate-700 mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base px-4">
          Dengan memohon rahmat dan ridho Allah SWT,
          kami mengundang Bapak/Ibu/Saudara/i <span className="font-bold text-retirement-dark">{guestName}</span> untuk menghadiri pernikahan kami:
        </p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-4 sm:p-6 border border-retirement-muted rounded-lg"
          >
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-retirement-dark mb-2" style={{ fontFamily: 'Almibar Pro' }}>Rival Biasrori</h3>
            <p className="text-slate-600 mb-4 text-sm sm:text-base">
              Putra dari Pasangan<br />
              Bapak Asriadi & Ibu Rabiah
            </p>
            <div className="flex justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-retirement/10 flex items-center justify-center">
                <span className="text-retirement text-xl sm:text-2xl font-bold">R</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-4 sm:p-6 border border-retirement-muted rounded-lg"
          >
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-retirement-dark mb-2" style={{ fontFamily: 'Almibar Pro' }}>Syahrina Ulya Ramadhani</h3>
            <p className="text-slate-600 mb-4 text-sm sm:text-base">
              Putri dari Pasangan<br />
              Bapak H. Syafi i Muzhar & Ibu Hj. Lailin Hijriani
            </p>
            <div className="flex justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-retirement/10 flex items-center justify-center">
                <span className="text-retirement text-xl sm:text-2xl font-bold">S</span>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-slate-600 italic text-xs sm:text-sm px-2">
          "Maha Suci Allah yang telah menciptakan pasangan-pasangan semuanya, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka maupun dari apa yang tidak mereka ketahui."
        </p>
        <p className="text-retirement-dark mt-3 italic text-xs sm:text-sm font-semibold">— QS. Yasin: 36</p>
      </motion.div>
    </section>
  );
}
