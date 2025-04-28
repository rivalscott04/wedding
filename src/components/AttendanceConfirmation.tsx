import React, { useState } from 'react';
import { localGuestService } from '@/api/localGuestService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  guestName: string;
}

export default function AttendanceConfirmation({ guestSlug, guestName }: AttendanceConfirmationProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const { toast } = useToast();

  const handleConfirmAttendance = async () => {
    setIsSubmitting(true);
    try {
      // Coba cari tamu berdasarkan slug
      const guest = await localGuestService.getGuestBySlug(guestSlug);

      if (guest) {
        // Jika tamu ditemukan, update kehadiran
        await localGuestService.updateAttendance(guestSlug, 'confirmed', notes);
        setIsConfirmed(true);
        setIsConfirmDialogOpen(false);
        toast({
          title: "Terima Kasih",
          description: "Konfirmasi kehadiran Anda telah kami terima."
        });
      } else {
        // Jika tamu tidak ditemukan, coba cari dengan nama yang sama
        const guests = await localGuestService.getGuests();
        const matchingGuest = guests.find(g =>
          g.name.toLowerCase().trim() === guestSlug.toLowerCase().trim()
        );

        if (matchingGuest) {
          // Jika ditemukan tamu dengan nama yang sama, update kehadiran
          await localGuestService.updateAttendance(matchingGuest.slug, 'confirmed', notes);
          setIsConfirmed(true);
          setIsConfirmDialogOpen(false);
          toast({
            title: "Terima Kasih",
            description: "Konfirmasi kehadiran Anda telah kami terima."
          });
        } else {
          toast({
            title: "Error",
            description: "Tamu tidak ditemukan.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan konfirmasi kehadiran.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineAttendance = async () => {
    setIsSubmitting(true);
    try {
      // Coba cari tamu berdasarkan slug
      const guest = await localGuestService.getGuestBySlug(guestSlug);

      if (guest) {
        // Jika tamu ditemukan, update kehadiran
        await localGuestService.updateAttendance(guestSlug, 'declined', notes);
        setIsDeclined(true);
        setIsDeclineDialogOpen(false);
        toast({
          title: "Terima Kasih",
          description: "Konfirmasi ketidakhadiran Anda telah kami terima."
        });
      } else {
        // Jika tamu tidak ditemukan, coba cari dengan nama yang sama
        const guests = await localGuestService.getGuests();
        const matchingGuest = guests.find(g =>
          g.name.toLowerCase().trim() === guestSlug.toLowerCase().trim()
        );

        if (matchingGuest) {
          // Jika ditemukan tamu dengan nama yang sama, update kehadiran
          await localGuestService.updateAttendance(matchingGuest.slug, 'declined', notes);
          setIsDeclined(true);
          setIsDeclineDialogOpen(false);
          toast({
            title: "Terima Kasih",
            description: "Konfirmasi ketidakhadiran Anda telah kami terima."
          });
        } else {
          toast({
            title: "Error",
            description: "Tamu tidak ditemukan.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan konfirmasi.",
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
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-4">Konfirmasi Kehadiran</h2>
      <div className="w-24 h-1 bg-primary/30 mx-auto mb-6"></div>

      <p className="text-center text-gray-600 mb-8">
        Dengan penuh rasa syukur, kami mengundangmu untuk hadir<br />
        di hari pernikahan kami, <span className="font-semibold">{guestName}</span>.
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
