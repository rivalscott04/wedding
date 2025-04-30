import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { AppSettings } from '@/types/settings';
import { settingsService } from '@/api/settingsService';
import { useToast } from '@/hooks/use-admin-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import DomainSettings from '@/components/DomainSettings';
import {
  Music,
  Image,
  Clock,
  MessageSquare,
  Calendar,
  Moon,
  Sun,
  SunMoon,
  Globe
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch app settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => settingsService.getAppSettings()
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updatedSettings: AppSettings) => {
      return settingsService.updateAppSettings(updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      toast({
        title: "Pengaturan Berhasil Disimpan",
        description: "Pengaturan aplikasi telah diperbarui.",
        variant: "success"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan aplikasi.",
        variant: "destructive"
      });
    }
  });

  const handleToggleChange = (key: keyof AppSettings, value: boolean) => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      [key]: value
    };

    updateSettingsMutation.mutate(updatedSettings);
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'auto') => {
    if (!settings) return;

    const updatedSettings = {
      ...settings,
      theme: value
    };

    updateSettingsMutation.mutate(updatedSettings);
  };

  if (isLoading || !settings) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <p>Memuat pengaturan aplikasi...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Pengaturan Aplikasi</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain
              </CardTitle>
              <CardDescription>
                Atur domain kustom untuk link undangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainSettings />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tampilan</CardTitle>
              <CardDescription>
                Atur tampilan dan tema aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Pilih tema tampilan untuk undangan
                  </p>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'auto')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span>Terang</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span>Gelap</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">
                      <div className="flex items-center gap-2">
                        <SunMoon className="h-4 w-4" />
                        <span>Otomatis</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fitur</CardTitle>
              <CardDescription>
                Aktifkan atau nonaktifkan fitur-fitur undangan
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Music className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Musik Latar</Label>
                    <p className="text-sm text-muted-foreground">
                      Putar musik latar saat undangan dibuka
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.music_enabled}
                  onCheckedChange={(checked) => handleToggleChange('music_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Galeri Foto</Label>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan galeri foto di halaman undangan
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.show_gallery}
                  onCheckedChange={(checked) => handleToggleChange('show_gallery', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Hitung Mundur</Label>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan hitung mundur menuju hari pernikahan
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.show_countdown}
                  onCheckedChange={(checked) => handleToggleChange('show_countdown', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Ucapan dan Doa</Label>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan form ucapan dan doa dari tamu
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.show_wishes}
                  onCheckedChange={(checked) => handleToggleChange('show_wishes', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="text-base">Konfirmasi Kehadiran</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan fitur RSVP untuk konfirmasi kehadiran
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.rsvp_enabled}
                  onCheckedChange={(checked) => handleToggleChange('rsvp_enabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
