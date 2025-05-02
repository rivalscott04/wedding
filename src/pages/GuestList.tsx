
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Guest } from '@/types/guest-local';
import { guestService } from '@/services/guest-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Share2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GuestList() {
  const [guestName, setGuestName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch guests
  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: guestService.getGuests
  });

  // Add guest mutation
  const addGuestMutation = useMutation({
    mutationFn: (newGuest: Omit<Guest, 'id' | 'created_at'>) => {
      return guestService.addGuest(newGuest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setGuestName('');
      toast({
        title: "Sukses",
        description: "Tamu berhasil ditambahkan"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan tamu",
        variant: "destructive"
      });
    }
  });

  const handleAddGuest = () => {
    if (!guestName.trim()) {
      toast({
        title: "Error",
        description: "Nama tamu tidak boleh kosong",
        variant: "destructive"
      });
      return;
    }

    const newGuest = {
      name: guestName,
      slug: guestName.trim(), // Menggunakan nama asli tanpa perubahan
      status: 'active' as const
    };

    addGuestMutation.mutate(newGuest);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await guestService.importGuests(file);
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Sukses",
        description: "Data tamu berhasil diimport"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengimport data tamu",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const invitationLink = `${window.location.origin}/undangan?to=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: "Sukses",
      description: "Link undangan berhasil disalin"
    });
  };

  const handleShareWhatsApp = (guest: Guest) => {
    const invitationLink = `${window.location.origin}/undangan?to=${encodeURIComponent(guest.slug)}`;

    // Membuat pesan WhatsApp
    const phoneNumber = ""; // Kosong untuk membuka WhatsApp tanpa nomor tujuan
    // Letakkan URL di awal pesan untuk memastikan preview gambar muncul
    const message = `${invitationLink}\n\nAssalamu'alaikum Wr. Wb.\n\nKepada Yth.\n${guest.name}\n\nSilakan buka link undangan di atas.`;

    // Menggunakan wa.me langsung
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Manajemen Tamu Undangan</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Masukkan nama tamu"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>
          <Button onClick={handleAddGuest} disabled={addGuestMutation.isPending}>
            Tambah Tamu
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('csv-upload')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Tamu</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests?.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">{guest.name}</TableCell>
                <TableCell>{guest.slug}</TableCell>
                <TableCell>{guest.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyLink(guest.slug)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShareWhatsApp(guest)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
