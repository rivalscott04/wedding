import React from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppShareProps {
  text?: string;
  url?: string;
  className?: string;
}

export function WhatsAppShare({
  text = "Undangan Pernikahan Rival & Syahrina. Silakan klik link berikut untuk melihat undangan:",
  url,
  className
}: WhatsAppShareProps) {
  const shareUrl = url || window.location.href;

  const handleShare = () => {
    // Menggunakan wa.me langsung
    const phoneNumber = ""; // Kosong untuk membuka WhatsApp tanpa nomor tujuan
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Button
        onClick={handleShare}
        className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2"
      >
        <Share className="h-4 w-4" />
        <span>Bagikan via WhatsApp</span>
      </Button>
    </motion.div>
  );
}
