import React from "react";
import { useSearchParams } from "react-router-dom";
import AttendanceConfirmation from "@/components/AttendanceConfirmation";
import { ScrollAnimation } from "@/components/animations/ScrollAnimation";

export function RSVPConfirm() {
  const [searchParams] = useSearchParams();
  const guestSlug = searchParams.get("to") || "Tamu Undangan";

  return (
    <section id="rsvp" className="py-12 md:py-20 px-4 bg-white">
      <ScrollAnimation
        type="slide-up"
        duration={0.8}
        className="max-w-xl mx-auto text-center"
      >
        <AttendanceConfirmation guestSlug={guestSlug} />
      </ScrollAnimation>
    </section>
  );
}
