
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export function EventDetails() {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-20 px-4 bg-retirement-light/30">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-retirement-dark mb-4">Rangkaian Acara</h2>
          <div className="w-16 sm:w-20 h-1 bg-retirement-accent/50 mx-auto mb-4 sm:mb-6 rounded-full"></div>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base px-2">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-retirement-muted/30 shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-xl sm:text-2xl text-retirement-dark">Akad Nikah</CardTitle>
                <CardDescription>Ijab Kabul Pernikahan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <Calendar className="mr-3 h-4 sm:h-5 w-4 sm:w-5 text-retirement" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Minggu, 25 Mei 2025</div>
                    <div className="text-xs sm:text-sm text-slate-500">27 Dzulqaidah 1446 H</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="mr-3 h-4 sm:h-5 w-4 sm:w-5 text-retirement" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">08:00 - 9:00 WITA</div>
                    <div className="text-xs sm:text-sm text-slate-500">Akad Pernikahan</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 h-4 sm:h-5 w-4 sm:w-5 text-retirement" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Dusun Dalam Lauq, Desa Kotaraja</div>
                    <div className="text-xs sm:text-sm text-slate-500">Jl. Raden Lung Negare</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className="w-full border-retirement text-retirement hover:bg-retirement hover:text-white"
                  onClick={() => window.open("https://maps.app.goo.gl/ihqFznWfXqXe8wmbA", "_blank")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Buka Google Maps
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-retirement-muted/30 shadow-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-xl sm:text-2xl text-retirement-dark">Resepsi</CardTitle>
                <CardDescription>Walimatul 'Ursy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <Calendar className="mr-3 h-4 sm:h-5 w-4 sm:w-5 text-retirement" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Minggu, 25 Mei 2025</div>
                    <div className="text-xs sm:text-sm text-slate-500">27 Dzulqaidah 1446 H</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="mr-3 h-4 sm:h-5 w-4 sm:w-5 text-retirement" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">10:00 - 12.30 WITA</div>
                    <div className="text-xs sm:text-sm text-slate-500">Resepsi Pernikahan</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 h-4 sm:h-5 w-4 sm:w-5 text-retirement" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Dusun Dalam Lauq, Desa Kotaraja</div>
                    <div className="text-xs sm:text-sm text-slate-500">Jl. Raden Lung Negare</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className="w-full border-retirement text-retirement hover:bg-retirement hover:text-white"
                  onClick={() => window.open("https://maps.app.goo.gl/ihqFznWfXqXe8wmbA", "_blank")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Buka Google Maps
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
