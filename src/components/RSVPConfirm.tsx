import React from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import AttendanceConfirmation from "@/components/AttendanceConfirmation";

export function RSVPConfirm() {
  const [searchParams] = useSearchParams();
  const guestSlug = searchParams.get("to") || "Tamu Undangan";

  return (
    <section id="rsvp" className="py-12 md:py-20 px-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto text-center"
      >
        <AttendanceConfirmation guestSlug={guestSlug} guestName={guestSlug} />
      </motion.div>
    </section>
  );
}
