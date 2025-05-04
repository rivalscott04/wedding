
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Heart, ThumbsUp, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiMessageService } from "@/api/apiMessageService";
import ReactConfetti from "react-confetti";

interface WishFormData {
  name: string;
  message: string;
}

interface WishesFormProps {
  onWishSent: (wish: WishFormData & { timestamp: string }) => void;
}

export function WishesForm({ onWishSent }: WishesFormProps) {
  const [formData, setFormData] = useState<WishFormData>({
    name: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const formRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Get window dimensions for confetti
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial dimensions
    updateWindowDimensions();

    // Update on resize
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  // Hide confetti after 5 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi nama dan ucapan Anda",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      // Simpan ucapan ke database
      const newMessage = await apiMessageService.addMessage({
        name: formData.name,
        message: formData.message
      });

      console.log("New message saved to database:", newMessage);

      // Kirim ke parent component untuk ditampilkan
      onWishSent({
        name: newMessage.name,
        message: newMessage.message,
        timestamp: newMessage.created_at
      });

      console.log("Message sent to parent component");

      // Show success animations
      setShowConfetti(true);
      setShowSuccessAnimation(true);

      // Hide success animation after 2 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);

      // Reset form
      setFormData({
        name: "",
        message: ""
      });

      toast({
        title: "Ucapan terkirim",
        description: "Terima kasih atas ucapan dan doa Anda"
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Gagal mengirim ucapan",
        description: "Terjadi kesalahan saat mengirim ucapan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-retirement-muted/30 relative overflow-hidden"
    >
      {/* Confetti effect when message is sent */}
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={isMobile ? 100 : 200}
          gravity={0.15}
          colors={['#F9A8D4', '#F472B6', '#EC4899', '#BE185D', '#9D174D']}
        />
      )}

      {/* Success animation overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{
                scale: [0.5, 1.2, 1],
                rotate: [-10, 10, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 0.6, times: [0, 0.5, 1] }}
              className="text-pink-500 mb-4"
            >
              <Heart className="h-16 w-16 fill-pink-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-lg font-medium text-retirement-dark text-center"
            >
              Terima Kasih!
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-sm text-slate-600 text-center"
            >
              Ucapan Anda telah terkirim
            </motion.p>

            {/* Floating icons */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-1/4 left-1/4 text-pink-400"
            >
              <ThumbsUp className="h-6 w-6" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-1/3 right-1/4 text-pink-500"
            >
              <Star className="h-8 w-8" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-1/4 right-1/3 text-pink-300"
            >
              <Heart className="h-5 w-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-lg sm:text-xl font-medium text-retirement-dark mb-4">Kirim Ucapan & Doa</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Input
            type="text"
            name="name"
            placeholder="Nama Anda"
            value={formData.name}
            onChange={handleChange}
            className="w-full text-sm sm:text-base border-retirement-muted/50 focus:border-retirement focus:ring-retirement"
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Textarea
            name="message"
            placeholder="Ucapan & doa untuk pengantin..."
            value={formData.message}
            onChange={handleChange}
            rows={isMobile ? 3 : 4}
            className="w-full text-sm sm:text-base border-retirement-muted/50 focus:border-retirement focus:ring-retirement"
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            size={isMobile ? "default" : "lg"}
            className="w-full bg-retirement hover:bg-retirement-dark relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              )}
              Kirim Ucapan
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
