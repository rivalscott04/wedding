import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Guest } from '@/types/guest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Upload, Trash2, Edit, Check, X, Calendar, AlertCircle, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-admin-toast';
import Papa from 'papaparse';
import AdminLayout from '@/components/AdminLayout';
import WhatsAppTemplate from '@/components/WhatsAppTemplate';
import { format } from 'date-fns';
import { axiosGuestService } from '@/api/axiosGuestService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const generateSlug = (name: string) => {
  // Format slug dengan benar: lowercase dan ganti spasi dengan dash
  return name.trim().toLowerCase().replace(/\s+/g, '-');
};

export default function AdminGuestManagement() {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch guests
  const { data: guests, isLoading, isError, error } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      try {
        const result = await axiosGuestService.getGuests();
        return result;
      } catch (error) {
        setApiError(error.message || 'Failed to fetch guests');
        throw error;
      }
    }
  });

  // Add guest mutation
  const addGuestMutation = useMutation({
    mutationFn: (newGuest: Omit<Guest, 'id' | 'created_at'>) => {
      setApiError(null); // Reset any previous errors
      return axiosGuestService.addGuest(newGuest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setGuestName('');
      setApiError(null);
      toast({
        title: "Tamu Berhasil Ditambahkan",
        description: "Undangan telah dibuat untuk tamu baru.",
        variant: "success"
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Gagal menambahkan tamu";
      setApiError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  // Update guest mutation
  const updateGuestMutation = useMutation({
    mutationFn: (guest: Guest) => {
      return axiosGuestService.updateGuest(guest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setEditingGuest(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Tamu Berhasil Diperbarui",
        description: "Data tamu telah diperbarui.",
        variant: "success"
      });
    }
  });

  // Delete guest mutation
  const deleteGuestMutation = useMutation({
    mutationFn: (id: number) => {
      return axiosGuestService.deleteGuest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      toast({
        title: "Tamu Berhasil Dihapus",
        description: "Data tamu telah dihapus dari sistem.",
        variant: "success"
      });
    }
  });

  // Validasi nama tamu
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError("Nama tamu tidak boleh kosong");
      return false;
    }

    // Check for duplicate names
    const isDuplicate = guests?.some(
      guest => guest.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      setNameError("Nama tamu sudah ada dalam daftar");
      return false;
    }

    setNameError(null);
    return true;
  };

  // Validasi nomor HP (opsional)
  const validatePhone = (phone: string) => {
    if (!phone) {
      // Nomor HP opsional
      setPhoneError(null);
      return true;
    }

    // Format nomor HP Indonesia: diawali dengan 62 atau 0, diikuti 8-13 digit
    const phoneRegex = /^(62|0)\d{8,13}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Format nomor HP tidak valid (contoh: 628123456789)");
      return false;
    }

    setPhoneError(null);
    return true;
  };

  // Validasi real-time saat input berubah
  useEffect(() => {
    if (guestName) validateName(guestName);
  }, [guestName, guests]);

  useEffect(() => {
    if (guestPhone) validatePhone(guestPhone);
  }, [guestPhone]);

  const handleAddGuest = () => {
    // Validasi input
    const isNameValid = validateName(guestName);
    const isPhoneValid = validatePhone(guestPhone);

    if (!isNameValid || !isPhoneValid) {
      return;
    }

    const newGuest: Guest = {
      name: guestName,
      slug: generateSlug(guestName),
      status: 'active',
      attended: 0, // Default: belum konfirmasi kehadiran (0)
      isNewGuest: true // Tandai sebagai tamu baru
    };

    // Tambahkan nomor HP jika ada
    if (guestPhone) {
      newGuest.phone_number = guestPhone;
    }

    try {
      addGuestMutation.mutate(newGuest);
      setGuestName(''); // Reset nama tamu
      setGuestPhone(''); // Reset nomor HP
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan tamu",
        variant: "destructive"
      });
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest({...guest});
    setIsEditDialogOpen(true);
  };

  const handleUpdateGuest = () => {
    if (!editingGuest) return;

    if (!editingGuest.name.trim()) {
      toast({
        title: "Error",
        description: "Nama tamu tidak boleh kosong",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names (excluding the current guest being edited)
    const isDuplicate = guests?.some(
      guest => guest.id !== editingGuest.id &&
               guest.name.toLowerCase() === editingGuest.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "Nama tamu sudah ada dalam daftar",
        variant: "destructive"
      });
      return;
    }

    // Simpan status kehadiran yang ada (jangan diubah oleh admin)
    const { attendance, attendance_date, attendance_notes } = editingGuest;

    updateGuestMutation.mutate({
      ...editingGuest,
      slug: generateSlug(editingGuest.name),
      // Pastikan status kehadiran tidak berubah
      attendance,
      attendance_date,
      attendance_notes
    });
  };

  const handleDeleteGuest = (id: number) => {
    setGuestToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGuest = () => {
    if (guestToDelete === null) return;

    // Close the dialog first
    setIsDeleteDialogOpen(false);

    // Then process the deletion
    deleteGuestMutation.mutate(guestToDelete);
    setGuestToDelete(null);

    // Show processing toast (will auto-close after 2 seconds)
    toast({
      title: "Menghapus tamu",
      description: "Tamu sedang dihapus...",
      variant: "info"
    });
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
          status: 'active' as const,
          attended: 0, // Default: belum konfirmasi kehadiran (0)
          isNewGuest: true // Tandai sebagai tamu baru
        }));

        try {
          await axiosGuestService.importGuests(guests);

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

  const handleCopyLink = async (guest: Guest) => {
    try {
      // Menggunakan utility untuk membuat pesan undangan
      const { createInvitationMessage } = await import('@/lib/urlUtils');
      const message = await createInvitationMessage(guest.name, guest.slug);

      navigator.clipboard.writeText(message);
      toast({
        title: "Pesan Disalin",
        description: "Pesan undangan lengkap telah disalin ke clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyalin pesan undangan",
        variant: "destructive"
      });
    }
  };

  const handleShareWhatsApp = async (guest: Guest) => {
    try {
      const phoneNumber = guest.phone_number || ""; // Gunakan nomor HP tamu jika ada

      // Menggunakan utility untuk membuat pesan undangan dan URL WhatsApp
      const { createInvitationMessage, createWhatsAppUrl } = await import('@/lib/urlUtils');
      const message = await createInvitationMessage(guest.name, guest.slug);
      const whatsappLink = await createWhatsAppUrl(phoneNumber, message);

      window.open(whatsappLink, '_blank');

      // Tampilkan toast jika tidak ada nomor HP
      if (!phoneNumber) {
        toast({
          title: "Perhatian",
          description: "Tamu ini tidak memiliki nomor HP. WhatsApp akan dibuka tanpa nomor tujuan."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuka WhatsApp",
        variant: "destructive"
      });
    }
  };

  // Pastikan guests adalah array sebelum melakukan filter
  const filteredGuests = Array.isArray(guests)
    ? guests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];



  return (
    <AdminLayout>
      <TooltipProvider>
      <div className="w-full px-1 sm:px-4 py-2 sm:py-6">
        <Card className="mb-3 sm:mb-8 shadow-sm">
          <CardHeader className="px-3 py-2 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-xl">Manajemen Tamu Undangan</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Kelola daftar tamu undangan pernikahan Anda
            </CardDescription>
            {apiError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
                <p className="font-semibold">Error API:</p>
                <p>{apiError}</p>
              </div>
            )}
            {isError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
                <p className="font-semibold">Error Loading Data:</p>
                <p>{error?.message || 'Unknown error'}</p>
              </div>
            )}
          </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3">
          <div className="flex flex-col gap-2 sm:gap-4 mb-3 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1">
                <Input
                  placeholder="Masukkan nama tamu"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className={`text-xs sm:text-base h-8 sm:h-10 ${nameError ? 'border-red-500' : ''}`}
                />
                {nameError && (
                  <p className="text-red-500 text-xs">{nameError}</p>
                )}
              </div>
              <div className="space-y-1">
                <Input
                  placeholder="Nomor HP (opsional, contoh: 628123456789)"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className={`text-xs sm:text-base h-8 sm:h-10 ${phoneError ? 'border-red-500' : ''}`}
                />
                {phoneError && (
                  <p className="text-red-500 text-xs">{phoneError}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Button
                onClick={handleAddGuest}
                disabled={addGuestMutation.isPending}
                className="w-full sm:w-auto h-8 sm:h-10"
                size="sm"
              >
                <span className="text-xs sm:text-sm">
                  {addGuestMutation.isPending ? 'Menambahkan...' : 'Tambah Tamu'}
                </span>
              </Button>



              <div className="relative w-full sm:w-auto">
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
                  className="w-full h-8 sm:h-10"
                  size="sm"
                >
                  <Upload className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Import CSV</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-3 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Cari tamu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-md text-xs sm:text-base h-8 sm:h-10"
              />
            </div>











          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border bg-white shadow-sm overflow-x-auto mb-3 sm:mb-6">
        <Table className="min-w-[400px] w-full">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[25%]">Nama</TableHead>
              <TableHead className="hidden sm:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[20%]">Slug</TableHead>
              <TableHead className="hidden md:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[15%]">Nomor HP</TableHead>
              <TableHead className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[15%]">
                <div className="flex items-center gap-1">
                  Status
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-3 w-3 p-0">
                        <HelpCircle className="h-2 w-2 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px] sm:text-xs">
                      Status menentukan apakah tamu dapat mengakses undangan
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="hidden sm:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[20%]">
                <div className="flex items-center gap-1">
                  Kehadiran
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-3 w-3 p-0">
                        <HelpCircle className="h-2 w-2 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px] sm:text-xs">
                      Status kehadiran tamu pada acara pernikahan
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="text-right py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[15%]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Memuat data tamu...
                </TableCell>
              </TableRow>
            ) : filteredGuests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Tidak ada data tamu
                </TableCell>
              </TableRow>
            ) : (
              filteredGuests?.map((guest) => (
                <TableRow key={guest.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                    <div>
                      {guest.name}
                      <div className="md:hidden text-[8px] sm:text-xs text-muted-foreground mt-0.5">
                        {guest.phone_number && (
                          <div className="flex items-center gap-1">
                            <span>HP: {guest.phone_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{guest.slug}</TableCell>
                  <TableCell className="hidden md:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">{guest.phone_number || '-'}</TableCell>
                  <TableCell className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                    <Badge variant={guest.status === 'active' ? 'default' : 'outline'} className="text-[8px] sm:text-xs px-1 py-0 h-4">
                      {guest.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                    {guest.attended === true || guest.attended === 1 ? (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 text-[8px] sm:text-xs px-1 py-0 h-4">
                          <Check className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                          Hadir
                        </Badge>
                        {guest.attendance_date && (
                          <span className="text-[8px] sm:text-xs text-muted-foreground ml-1 sm:ml-2 flex items-center">
                            <Calendar className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                            {format(new Date(guest.attendance_date), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </div>
                    ) : guest.attendance_date ? (
                      <div className="flex items-center gap-1">
                        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 text-[8px] sm:text-xs px-1 py-0 h-4">
                          <X className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                          Tidak
                        </Badge>
                        <span className="text-[8px] sm:text-xs text-muted-foreground ml-1 sm:ml-2 flex items-center">
                          <Calendar className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                          {format(new Date(guest.attendance_date), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800 text-[8px] sm:text-xs px-1 py-0 h-4">
                        <AlertCircle className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                        Belum
                      </Badge>
                    )}
                    {guest.attendance_notes && (
                      <div className="mt-0.5 sm:mt-1">
                        <p className="text-[8px] sm:text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]" title={guest.attendance_notes}>
                          "{guest.attendance_notes}"
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-1 px-0.5 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                    <div className="flex justify-end gap-0.5 sm:gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyLink(guest)}
                        title="Salin Pesan Undangan"
                        className="h-5 w-5 sm:h-8 sm:w-8 p-0.5"
                      >
                        <Copy className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditGuest(guest)}
                        title="Edit Tamu"
                        className="h-5 w-5 sm:h-8 sm:w-8 p-0.5"
                      >
                        <Edit className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteGuest(guest.id!)}
                        title="Hapus Tamu"
                        className="h-5 w-5 sm:h-8 sm:w-8 p-0.5"
                      >
                        <Trash2 className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Tamu</DialogTitle>
            <DialogDescription>
              Perbarui informasi tamu undangan
            </DialogDescription>
          </DialogHeader>
          {editingGuest && (
            <>
              <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
                <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="name" className="text-right text-xs sm:text-sm">
                    Nama
                  </label>
                  <Input
                    id="name"
                    value={editingGuest.name}
                    onChange={(e) => setEditingGuest({...editingGuest, name: e.target.value})}
                    className="col-span-3 text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                  <label htmlFor="phone_number" className="text-right text-xs sm:text-sm">
                    Nomor HP
                  </label>
                  <Input
                    id="phone_number"
                    placeholder="Contoh: 628123456789"
                    value={editingGuest.phone_number || ''}
                    onChange={(e) => setEditingGuest({...editingGuest, phone_number: e.target.value})}
                    className="col-span-3 text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <label htmlFor="status" className="text-right text-xs sm:text-sm">
                      Status
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-5 sm:w-5 p-0">
                          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs sm:text-sm">
                        <p>Status <strong>Aktif</strong> berarti tamu dapat mengakses undangan dan memberikan ucapan.</p>
                        <p className="mt-1">Status <strong>Nonaktif</strong> berarti tamu tidak dapat mengakses undangan.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="col-span-3 flex gap-2 sm:gap-4">
                    <Button
                      variant={editingGuest.status === 'active' ? 'default' : 'outline'}
                      onClick={() => setEditingGuest({...editingGuest, status: 'active'})}
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                      size="sm"
                    >
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      Aktif
                    </Button>
                    <Button
                      variant={editingGuest.status === 'inactive' ? 'default' : 'outline'}
                      onClick={() => setEditingGuest({...editingGuest, status: 'inactive'})}
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                      size="sm"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      Nonaktif
                    </Button>
                  </div>
                </div>

                {/* Informasi kehadiran (hanya tampilan, tidak bisa diedit) */}
                {(editingGuest.attended === true || editingGuest.attended === 1 || (editingGuest.attendance_date && (editingGuest.attended === false || editingGuest.attended === 0))) && (
                  <div className="grid grid-cols-4 items-start gap-2 sm:gap-4">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <label className="text-right pt-1 sm:pt-2 text-xs sm:text-sm">
                        Info Kehadiran
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-5 sm:w-5 p-0 mt-1 sm:mt-2">
                            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs sm:text-sm">
                          <p>Status kehadiran tamu hanya dapat diubah oleh tamu melalui halaman undangan.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="col-span-3">
                      <div className="flex flex-col gap-1 sm:gap-2">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          {editingGuest.attended === true || editingGuest.attended === 1 ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 text-[10px] sm:text-xs">
                              <Check className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              Hadir
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-800 text-[10px] sm:text-xs">
                              <X className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              Tidak Hadir
                            </Badge>
                          )}

                          {editingGuest.attendance_date && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              Dikonfirmasi: {format(new Date(editingGuest.attendance_date), 'dd/MM/yyyy')}
                            </span>
                          )}
                        </div>

                        {editingGuest.attendance_notes && (
                          <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            <p>Catatan: "{editingGuest.attendance_notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-xs sm:text-sm h-8 sm:h-10"
                  size="sm"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleUpdateGuest}
                  className="text-xs sm:text-sm h-8 sm:h-10"
                  size="sm"
                >
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus tamu ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              Data tamu akan dihapus secara permanen dari sistem.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-xs sm:text-sm h-8 sm:h-10"
              size="sm"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteGuest}
              className="text-xs sm:text-sm h-8 sm:h-10"
              size="sm"
            >
              Hapus Tamu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WhatsAppTemplate className="mt-2 sm:mt-6" />
      </div>
      </TooltipProvider>
    </AdminLayout>
  );
}
