
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, CheckCheck, Send, Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Wish {
  name: string;
  message: string;
  timestamp: string;
}

export function AbsentFlow() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    message: ""
  });
  const [showCopied, setShowCopied] = useState({
    bank: false,
    ewallet: false,
    address: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi nama dan ucapan Anda",
        variant: "destructive"
      });
      return;
    }
    
    const newWish = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    setWishes(prev => [newWish, ...prev]);
    
    // Reset form
    setFormData({
      name: "",
      message: ""
    });
    
    toast({
      title: "Ucapan terkirim",
      description: "Terima kasih atas doa dan ucapan Anda"
    });
  };

  const handleCopy = (text: string, type: keyof typeof showCopied) => {
    navigator.clipboard.writeText(text);
    
    // Reset all copy states first
    setShowCopied({
      bank: false,
      ewallet: false,
      address: false
    });
    
    // Then set the current one to true
    setShowCopied(prev => ({ ...prev, [type]: true }));
    
    // Reset after 2 seconds
    setTimeout(() => {
      setShowCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
    
    toast({
      title: "Berhasil disalin",
      description: "Informasi telah disalin ke clipboard"
    });
  };
  
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return "baru saja";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto px-4 relative overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative elements */}
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-10 left-10 text-4xl text-gray-300 hidden sm:block"
      >
        🕊️
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 right-10 text-3xl text-gray-300 hidden sm:block"
      >
        🍃
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-40 left-20 text-3xl text-gray-300 hidden sm:block"
      >
        🕊️
      </motion.div>
      
      {/* Main content */}
      <motion.div
        className="space-y-8"
        variants={containerVariants}
      >
        {/* Islamic & Inclusive Prayer */}
        <motion.div 
          className="text-center space-y-6"
          variants={itemVariants}
        >
          <h2 className="text-xl sm:text-2xl font-medium font-serif text-retirement-dark">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base">
            Jazakumullah khairan atas niat baik dan doa restunya.
          </p>
          
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Semoga Allah SWT membalas segala kebaikanmu<br />
            dengan limpahan keberkahan, kesehatan, dan kebahagiaan.
          </p>
          
          <div className="pt-4 pb-2">
            <div className="w-16 h-px bg-retirement-muted mx-auto"></div>
          </div>
          
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Untuk saudara/i kami yang beragama lain,<br />
            kami menyampaikan terima kasih yang tulus atas cinta dan perhatianmu.<br />
            Semoga Tuhan Yang Maha Esa membalas semua kebaikanmu<br />
            dengan limpahan rahmat dan kebahagiaan.
          </p>
          
          <p className="text-retirement text-base sm:text-lg font-medium mt-4">
            💌 Terima kasih telah menjadi bagian dari hari bahagia kami.
          </p>
        </motion.div>
        
        {/* Wishes Form */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border border-retirement-muted/30"
          variants={itemVariants}
        >
          <h3 className="text-lg sm:text-xl font-medium text-retirement-dark mb-4">
            Kirim Doa & Ucapan
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Nama Anda"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-retirement-muted/50 focus:border-retirement focus:ring-retirement"
              />
            </div>
            
            <div>
              <Textarea
                name="message"
                placeholder="Ucapan & doa untuk pengantin..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full border-retirement-muted/50 focus:border-retirement focus:ring-retirement"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-retirement hover:bg-retirement-dark"
            >
              <Send className="mr-2 h-4 w-4" />
              Kirim Ucapan
            </Button>
          </form>
        </motion.div>
        
        {/* Gift Section */}
        <motion.div
          className="pt-4"
          variants={itemVariants}
        >
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-medium text-retirement-dark mb-2">
              🎁 Ingin Berbagi Kebahagiaan?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Kehadiran dan doa Anda adalah hadiah terindah bagi kami.
              <br />Namun jika berkenan memberi hadiah, dapat melalui:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-retirement-light/30 border-retirement-muted/30">
              <CardContent className="pt-6">
                <h4 className="font-medium text-retirement-dark mb-2">Rekening Bank</h4>
                <p className="text-sm text-slate-600 mb-4">BCA 123456789 a.n. Syahrina</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-retirement-muted text-retirement hover:bg-retirement/10"
                  onClick={() => handleCopy("BCA 123456789 a.n. Syahrina", "bank")}
                >
                  {showCopied.bank ? (
                    <>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Salin
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-retirement-light/30 border-retirement-muted/30">
              <CardContent className="pt-6">
                <h4 className="font-medium text-retirement-dark mb-2">E-Wallet / QRIS</h4>
                <p className="text-sm text-slate-600 mb-4">DANA: 081234567890 (Rival)</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-retirement-muted text-retirement hover:bg-retirement/10"
                  onClick={() => handleCopy("DANA: 081234567890 (Rival)", "ewallet")}
                >
                  {showCopied.ewallet ? (
                    <>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Salin
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-retirement-light/30 border-retirement-muted/30">
              <CardContent className="pt-6">
                <h4 className="font-medium text-retirement-dark mb-2">Alamat</h4>
                <p className="text-sm text-slate-600 mb-4">Jl. Bahagia No. 45, Bandung</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-retirement-muted text-retirement hover:bg-retirement/10"
                  onClick={() => handleCopy("Jl. Bahagia No. 45, Bandung", "address")}
                >
                  {showCopied.address ? (
                    <>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Salin
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center text-xs sm:text-sm text-slate-500 mt-5">
            Semoga setiap kebaikan menjadi amal yang diberkahi.
          </p>
        </motion.div>
        
        {/* Wishes List */}
        {wishes.length > 0 && (
          <motion.div
            className="mt-8 space-y-4"
            variants={itemVariants}
          >
            <h3 className="text-lg sm:text-xl font-medium text-retirement-dark mb-4">
              Ucapan & Doa Tamu
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {wishes.map((wish, index) => (
                <motion.div
                  key={`${wish.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-retirement-light/30 rounded-lg p-4 border border-retirement-muted/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-retirement-dark">{wish.name}</div>
                    <div className="text-xs text-slate-500">{formatTime(wish.timestamp)}</div>
                  </div>
                  <p className="text-slate-700 text-sm">{wish.message}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
