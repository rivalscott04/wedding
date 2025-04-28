import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import AdminLayout from '@/components/AdminLayout';
import { WeddingSettings } from '@/types/settings';
import { settingsService } from '@/api/settingsService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminEventSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wedding settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['weddingSettings'],
    queryFn: () => settingsService.getWeddingSettings()
  });

  // Form setup
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<WeddingSettings>();

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updatedSettings: WeddingSettings) => {
      return settingsService.updateWeddingSettings(updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddingSettings'] });
      toast({
        title: "Pengaturan Berhasil Disimpan",
        description: "Detail acara pernikahan telah diperbarui."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan acara.",
        variant: "destructive"
      });
    }
  });

  // Reset form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (data: WeddingSettings) => {
    updateSettingsMutation.mutate({
      ...data,
      id: settings?.id
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <p>Memuat pengaturan acara...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Pengaturan Acara</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pengantin</CardTitle>
                <CardDescription>
                  Masukkan nama pengantin pria dan wanita
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groom_name">Nama Pengantin Pria</Label>
                    <Input
                      id="groom_name"
                      placeholder="Masukkan nama pengantin pria"
                      {...register("groom_name", { required: "Nama pengantin pria wajib diisi" })}
                    />
                    {errors.groom_name && (
                      <p className="text-sm text-red-500">{errors.groom_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bride_name">Nama Pengantin Wanita</Label>
                    <Input
                      id="bride_name"
                      placeholder="Masukkan nama pengantin wanita"
                      {...register("bride_name", { required: "Nama pengantin wanita wajib diisi" })}
                    />
                    {errors.bride_name && (
                      <p className="text-sm text-red-500">{errors.bride_name.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waktu Acara</CardTitle>
                <CardDescription>
                  Atur tanggal dan waktu acara pernikahan
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wedding_date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tanggal Pernikahan
                    </Label>
                    <Input
                      id="wedding_date"
                      type="datetime-local"
                      {...register("wedding_date", { required: "Tanggal pernikahan wajib diisi" })}
                    />
                    {errors.wedding_date && (
                      <p className="text-sm text-red-500">{errors.wedding_date.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="akad_time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Waktu Akad
                    </Label>
                    <Input
                      id="akad_time"
                      placeholder="Contoh: 08:00 - 10:00 WIB"
                      {...register("akad_time", { required: "Waktu akad wajib diisi" })}
                    />
                    {errors.akad_time && (
                      <p className="text-sm text-red-500">{errors.akad_time.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reception_time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Waktu Resepsi
                    </Label>
                    <Input
                      id="reception_time"
                      placeholder="Contoh: 11:00 - 14:00 WIB"
                      {...register("reception_time", { required: "Waktu resepsi wajib diisi" })}
                    />
                    {errors.reception_time && (
                      <p className="text-sm text-red-500">{errors.reception_time.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lokasi Acara</CardTitle>
                <CardDescription>
                  Masukkan detail lokasi acara pernikahan
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="venue_name" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Nama Tempat
                  </Label>
                  <Input
                    id="venue_name"
                    placeholder="Contoh: Hotel Grand Ballroom"
                    {...register("venue_name", { required: "Nama tempat wajib diisi" })}
                  />
                  {errors.venue_name && (
                    <p className="text-sm text-red-500">{errors.venue_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue_address">Alamat Lengkap</Label>
                  <Textarea
                    id="venue_address"
                    placeholder="Masukkan alamat lengkap lokasi acara"
                    {...register("venue_address", { required: "Alamat lokasi wajib diisi" })}
                  />
                  {errors.venue_address && (
                    <p className="text-sm text-red-500">{errors.venue_address.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue_map_link">Link Google Maps</Label>
                  <Input
                    id="venue_map_link"
                    placeholder="Contoh: https://maps.google.com/?q=-6.2088,106.8456"
                    {...register("venue_map_link")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Opsional. Masukkan link Google Maps untuk memudahkan tamu menemukan lokasi.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => reset(settings)}
                disabled={!isDirty || updateSettingsMutation.isPending}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={!isDirty || updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          </div>
        </form>

        {settings?.updated_at && (
          <p className="text-sm text-muted-foreground mt-4 text-right">
            Terakhir diperbarui: {format(new Date(settings.updated_at), 'dd MMMM yyyy, HH:mm')}
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
