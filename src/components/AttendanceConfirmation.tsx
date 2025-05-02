import { useState, useEffect } from 'react';
import { localGuestService } from '@/api/localGuestService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactConfetti from 'react-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AttendanceConfirmationProps {
  guestSlug: string;
}

export default function AttendanceConfirmation({ guestSlug }: AttendanceConfirmationProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { toast } = useToast();

  // Update window dimensions when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const handleConfirmAttendance = async () => {
    setIsSubmitting(true);
    try {
      // Coba cari tamu berdasarkan slug
      let guest = await localGuestService.getGuestBySlug(guestSlug);

      // Jika tidak ditemukan, coba cari dengan nama yang sama
      if (!guest) {
        const guests = await localGuestService.getGuests();

        // Coba cari dengan nama persis
        const matchingGuest = guests.find(g =>
          g.name.toLowerCase().trim() === guestSlug.toLowerCase().trim()
        );

        if (matchingGuest) {
          guest = matchingGuest;
        } else {
          // Coba cari dengan nama yang mengandung slug
          const partialMatch = guests.find(g =>
            g.name.toLowerCase().includes(guestSlug.toLowerCase()) ||
            guestSlug.toLowerCase().includes(g.name.toLowerCase())
          );

          if (partialMatch) {
            guest = partialMatch;
          }
        }
      }

      if (guest) {
        // Tampilkan animasi confetti untuk konfirmasi hadir
        setShowConfetti(true);
        // Jika tamu ditemukan, update kehadiran dengan boolean true (1)
        await localGuestService.updateAttendanceBoolean(guest.slug, true, notes);
        setIsConfirmed(true);
        setIsConfirmDialogOpen(false);
        toast({
          title: "Terima Kasih",
          description: "Jazakumullahu khairan bagi yang seiman. Semoga Allah SWT Tuhan Yang Maha Esa mempermudah setiap langkahmu menuju acara kami dan memberkahi silaturahmi ini. Sampai bertemu di hari bahagia kami, insyaAllah."
        });
      } else {
        // Jika masih tidak ditemukan, tambahkan tamu baru
        try {
          const newGuest = {
            name: guestSlug,
            slug: guestSlug.toLowerCase().replace(/\s+/g, '-'),
            status: 'active' as 'active', // Explicit type casting
            attended: true, // Boolean untuk kehadiran (1)
            attendance_notes: notes || ''
          };

          await localGuestService.addGuest(newGuest);
          setIsConfirmed(true);
          setIsConfirmDialogOpen(false);
          toast({
            title: "Terima Kasih",
            description: "Jazakumullahu khairan bagi yang seiman. Semoga Allah SWT Tuhan Yang Maha Esa mempermudah setiap langkahmu menuju acara kami dan memberkahi silaturahmi ini. Sampai bertemu di hari bahagia kami, insyaAllah."
          });
        } catch (addError) {
          console.error('Error adding new guest:', addError);
          toast({
            title: "Error",
            description: "Tamu tidak ditemukan dan gagal menambahkan tamu baru.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error in handleConfirmAttendance:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan konfirmasi kehadiran.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk menampilkan animasi merpati terbang
  const showDoveAnimation = () => {
    // Buat elemen merpati
    const dove = document.createElement('div');
    dove.className = 'flying-dove';
    dove.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40" fill="white">
        <path d="M160.8 96.5c14 17 31 30.9 49.5 42.2c25.9 15.8 53.7 25.9 77.7 31.6V138.8C265.8 108.5 250 71.5 248.6 28c-.4-11.3-7.5-21.5-18.4-24.4c-7.6-2-15.8-.2-21 5.8c-13.3 15.4-32.7 44.6-48.4 87.2zM320 144v30.6l0 0v1.3l0 0 0 32.1c-60.8-5.1-185-43.8-219.3-157.2C97.4 40 87.9 32 76.6 32c-7.9 0-15.3 3.9-18.8 11C46.8 65.9 32 112.1 32 176c0 116.9 80.1 180.5 118.4 202.8L11.8 416.6C6.7 418 2.6 421.8 .9 426.8s-.8 10.6 2.3 14.8C21.7 466.2 77.3 512 160 512c3.6 0 7.2-.1 10.7-.3c-7.2-16.4-9.2-34.5-9.2-42.5c0-20.9 3.4-66.2 24.9-112.2H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H240c5.5 0 10.9 .6 16 1.8l15.2 3.4c18.4-30.1 42.6-51.2 74.8-51.2h.3c.2 6.7 .3 13.3 .2 20c0 19.4-2 39.2-5.8 58.6c-4.1 21.2-10.1 41.9-18.3 61.3c0 0 0 0 0 0c-4.8 11.5-9.3 21.2-13.7 30.1l-.9 1.9c-1.3 2.7-2.6 5.3-4 7.9c-18.9 36.5-32.1 45-43.9 45c-30.5 0-58.3-15.4-65.7-48.2c-.5-2.4-1-4.9-1.4-7.4c-1.6-9.7-2.2-20.9-2.1-33.1c.2-27.9 3.7-59.5 8.8-90.3c-23.8 24.3-44.9 51.2-62.4 80.2L127.7 363c-3.8 6.4-11.9 8.2-18 4.2c-6-4-7.5-12.3-3.5-18.2L156.9 248.4c-14.6-14.8-57.5-64-50.4-147.3c.9-10.5 9.7-18.8 20.2-18.8c11.3 0 20.4 9.3 20.2 20.6c-.2 11.5 .3 21.9 1.3 31.1c3.3-11.8 7.5-22.9 12.4-33.1c-10.1 2.7-18.4 9.7-23.4 19.4c-1.3 2.5-2.5 5.1-3.6 7.8c-4.6 11.3-7.9 24.7-10 40.4c-1.4 10.5-10.3 18.3-20.9 18.3c-13.3 0-23.7-12.2-21-25.2c2.9-13.9 6.9-27.1 12-39.5c5.6-13.7 12.6-26.1 21-36.9c5.8-7.5 10.5-12.5 14.6-16.3c3.5-3.3 6.8-5.8 10.7-8c3.9-2.2 9-4.3 15.8-4.3c4.6 0 9.6 1 14.4 3.9c73.9 43.8 127.8 107.5 144.8 133.9zM480 240c0-8.8-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16zM346.5 477.8c-.9-5.3-1.7-10.7-2.4-16.2c-1.9-15.9-2.9-32.6-2.9-49.6c0-40.1 5.6-80.1 17.2-118.9c11.5-38.3 29-76.2 52.6-111.2C450.7 125.1 493.2 96 512 96c0 0 0 96-17.2 224c-8.7 64-26.8 114.3-46.1 149.6c-9.8 17.9-19.5 31.7-28.5 41.8c-9 10.1-17.8 16.6-26.1 16.6c-13.7 0-26.1-9.7-38.9-30.4c-3.5-5.7-6.8-12.2-9.8-19.8z"/>
      </svg>
    `;
    document.body.appendChild(dove);

    // Hapus elemen setelah animasi selesai
    setTimeout(() => {
      document.body.removeChild(dove);
    }, 2000);
  };

  const handleDeclineAttendance = async () => {
    setIsSubmitting(true);
    try {
      // Coba cari tamu berdasarkan slug
      let guest = await localGuestService.getGuestBySlug(guestSlug);

      // Jika tidak ditemukan, coba cari dengan nama yang sama
      if (!guest) {
        const guests = await localGuestService.getGuests();

        // Coba cari dengan nama persis
        const matchingGuest = guests.find(g =>
          g.name.toLowerCase().trim() === guestSlug.toLowerCase().trim()
        );

        if (matchingGuest) {
          guest = matchingGuest;
        } else {
          // Coba cari dengan nama yang mengandung slug
          const partialMatch = guests.find(g =>
            g.name.toLowerCase().includes(guestSlug.toLowerCase()) ||
            guestSlug.toLowerCase().includes(g.name.toLowerCase())
          );

          if (partialMatch) {
            guest = partialMatch;
          }
        }
      }

      if (guest) {
        // Tampilkan animasi merpati terbang untuk konfirmasi tidak hadir
        showDoveAnimation();
        // Jika tamu ditemukan, update kehadiran dengan boolean false (0)
        await localGuestService.updateAttendanceBoolean(guest.slug, false, notes);
        setIsDeclined(true);
        setIsDeclineDialogOpen(false);
        toast({
          title: "Terima Kasih",
          description: "Kami mengerti sepenuhnya, terima kasih sudah memberi kabar. Semoga Allah SWT Tuhan Yang Maha Esa senantiasa melindungi dan memudahkan langkahmu. Semoga kita dipertemukan di waktu dan momen bahagia lainnya, insyaAllah. 🤍"
        });
      } else {
        // Jika masih tidak ditemukan, tambahkan tamu baru
        try {
          const newGuest = {
            name: guestSlug,
            slug: guestSlug.toLowerCase().replace(/\s+/g, '-'),
            status: 'inactive' as 'inactive', // Explicit type casting
            attended: false, // Boolean untuk kehadiran (0)
            attendance_notes: notes || ''
          };

          await localGuestService.addGuest(newGuest);
          setIsDeclined(true);
          setIsDeclineDialogOpen(false);
          toast({
            title: "Terima Kasih",
            description: "Kami mengerti sepenuhnya, terima kasih sudah memberi kabar. Semoga Allah SWT Tuhan Yang Maha Esa senantiasa melindungi dan memudahkan langkahmu. Semoga kita dipertemukan di waktu dan momen bahagia lainnya, insyaAllah. 🤍"
          });
        } catch (addError) {
          console.error('Error adding new guest:', addError);
          toast({
            title: "Error",
            description: "Tamu tidak ditemukan dan gagal menambahkan tamu baru.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error in handleDeclineAttendance:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan konfirmasi ketidakhadiran.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 my-6">
        <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-green-800">Kehadiran Dikonfirmasi</h3>
        <p className="text-green-600">Terima kasih telah mengkonfirmasi kehadiran Anda.</p>
      </div>
    );
  }

  if (isDeclined) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 my-6">
        <X className="h-12 w-12 text-gray-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-800">Tidak Dapat Hadir</h3>
        <p className="text-gray-600">Terima kasih telah memberitahu kami.</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {/* Confetti effect when attendance is confirmed */}
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#F9A8D4', '#F472B6', '#EC4899', '#BE185D', '#9D174D']}
        />
      )}

      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-4">Konfirmasi Kehadiran</h2>
      <div className="w-24 h-1 bg-primary/30 mx-auto mb-6"></div>

      <p className="text-center text-gray-600 mb-8">
        Dengan penuh rasa syukur, kami mengundangmu untuk hadir<br />
        di hari pernikahan kami.
      </p>

      <p className="text-center text-gray-600 mb-8">
        Semoga Allah SWT Tuhan Yang Maha Esa mengizinkan kita<br />
        bertemu dan bersilaturahmi di momen bahagia ini.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          className="flex items-center gap-2 px-6 py-6"
          onClick={() => setIsConfirmDialogOpen(true)}
        >
          <Check className="h-5 w-5" />
          InsyaAllah, Saya akan Hadir
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 px-6 py-6"
          onClick={() => setIsDeclineDialogOpen(true)}
        >
          <X className="h-5 w-5" />
          Mohon maaf, belum bisa hadir
        </Button>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Kehadiran</DialogTitle>
            <DialogDescription>
              Catatan tambahan
            </DialogDescription>
            <p className="text-sm text-muted-foreground mt-1">
              Silakan berikan catatan tambahan jika diperlukan (opsional)
            </p>
          </DialogHeader>
          <Textarea
            placeholder="Contoh: Saya akan hadir bersama keluarga (3 orang)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={handleConfirmAttendance} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Konfirmasi Kehadiran"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Ketidakhadiran</DialogTitle>
            <DialogDescription>
              Alasan ketidakhadiran
            </DialogDescription>
            <p className="text-sm text-muted-foreground mt-1">
              Silakan berikan alasan ketidakhadiran jika berkenan (opsional)
            </p>
          </DialogHeader>
          <Textarea
            placeholder="Contoh: Mohon maaf, saya tidak bisa hadir karena ada acara keluarga"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="secondary" onClick={handleDeclineAttendance} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Konfirmasi Ketidakhadiran"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
