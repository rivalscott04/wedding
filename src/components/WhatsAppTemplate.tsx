import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface WhatsAppTemplateProps {
  className?: string;
}

export default function WhatsAppTemplate({ className }: WhatsAppTemplateProps) {
  return (
    <Card className={className + " shadow-sm"}>
      <CardHeader className="px-3 py-2 sm:px-6 sm:py-6">
        <CardTitle className="text-base sm:text-xl">Template Pesan WhatsApp</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Berikut adalah template pesan yang akan dikirim melalui WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-2 sm:pb-4">
        <Textarea
          className="min-h-[100px] sm:min-h-[150px] font-mono text-[9px] sm:text-xs"
          readOnly
          value={`Assalamu'alaikum Warahmatullahi Wabarakatuh,

Kepada Yth.
Bapak/Ibu/Saudara/i

*NAMA TAMU*

Dengan segala hormat dan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi saksi kebahagiaan kami dalam acara pernikahan yang insyaAllah akan dilangsungkan dalam waktu dekat.

Kehadiran dan doa restu dari Bapak/Ibu/Saudara/i akan menjadi hadiah terindah serta kenangan bermakna dalam lembaran baru perjalanan kami.

Untuk detail acara dan konfirmasi kehadiran, silakan klik tautan berikut:

LINK UNDANGAN

Semoga Allah SWT senantiasa melimpahkan cinta, keberkahan, dan kebahagiaan kepada kita semua.
Terima kasih atas perhatian dan doa yang tulus.
Kami sangat menantikan kehadiran Bapak/Ibu/Saudara/i di hari bahagia kami. 😊

Wassalamu'alaikum Warahmatullahi Wabarakatuh,
Kami yang berbahagia,
Rival dan Syahrina`}
        />
      </CardContent>
      <CardFooter className="px-3 sm:px-6 py-2 sm:py-4 text-[9px] sm:text-xs text-muted-foreground">
        Template ini akan otomatis mengisi nama tamu dan link undangan saat Anda mengklik tombol salin.
      </CardFooter>
    </Card>
  );
}
