
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { Guest } from '@/types/guest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Share2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const generateSlug = (name: string) => {
  // Hanya menggunakan nama asli tanpa perubahan
  return name.trim();
};

export default function GuestManagement() {
  const [guestName, setGuestName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch guests
  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Guest[];
    }
  });

  // Add guest mutation
  const addGuestMutation = useMutation({
    mutationFn: async (newGuest: Guest) => {
      const { data, error } = await supabase
        .from('guests')
        .insert(newGuest)
        .select()
        .single();

      if (error) throw error;
      return data as Guest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setGuestName('');
      toast({
        title: "Tamu Berhasil Ditambahkan",
        description: "Undangan telah dibuat untuk tamu baru."
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

    const newGuest: Guest = {
      name: guestName,
      slug: generateSlug(guestName),
      status: 'active'
    };

    addGuestMutation.mutate(newGuest);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      complete: async (results) => {
        const guests = results.data.slice(1).map((row: any) => ({
          name: row[0],
          slug: generateSlug(row[0]),
          status: 'active'
        }));

        try {
          const { error } = await supabase
            .from('guests')
            .insert(guests);

          if (error) throw error;

          queryClient.invalidateQueries({ queryKey: ['guests'] });
          toast({
            title: "Import Berhasil",
            description: "Data tamu telah berhasil diimport"
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
      },
      header: true
    });
  };

  const handleCopyLink = (slug: string) => {
    const invitationLink = `${window.location.origin}/undangan?to=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: "Link Tersalin",
      description: "Link undangan telah disalin ke clipboard"
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
