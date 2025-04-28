import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getSettingByKey, updateSetting } from '@/services/settingsService';
import { Loader2 } from 'lucide-react';

interface DomainSettingsProps {
  className?: string;
}

export default function DomainSettings({ className }: DomainSettingsProps) {
  const [domain, setDomain] = useState('');
  const [originalDomain, setOriginalDomain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadDomain = async () => {
      try {
        const domainValue = await getSettingByKey('domain');
        setDomain(domainValue || '');
        setOriginalDomain(domainValue || '');
      } catch (error) {
        console.error('Error loading domain setting:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat pengaturan domain',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDomain();
  }, [toast]);

  const handleSaveDomain = async () => {
    setIsSaving(true);
    try {
      // Validate domain format
      if (domain && !isValidDomain(domain)) {
        toast({
          title: 'Format Domain Tidak Valid',
          description: 'Masukkan domain yang valid, contoh: https://example.com',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }

      await updateSetting('domain', domain);
      setOriginalDomain(domain);
      toast({
        title: 'Pengaturan Disimpan',
        description: 'Domain berhasil diperbarui'
      });
    } catch (error) {
      console.error('Error saving domain setting:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan pengaturan domain',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isValidDomain = (url: string): boolean => {
    if (!url) return true; // Empty is valid (will use default)
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const hasChanges = domain !== originalDomain;

  return (
    <Card className={className}>
      <CardHeader className="px-3 py-2 sm:px-6 sm:py-6">
        <CardTitle className="text-base sm:text-xl">Pengaturan Domain</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Atur domain kustom untuk link undangan
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="domain" className="text-xs sm:text-sm font-medium mb-1 block">
                Domain Kustom
              </label>
              <Input
                id="domain"
                placeholder="https://example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Masukkan domain lengkap dengan protokol (https://). Biarkan kosong untuk menggunakan domain default.
              </p>
            </div>
            <div className="bg-muted/30 p-2 sm:p-3 rounded-md border">
              <h4 className="text-xs sm:text-sm font-medium mb-1">Contoh Link Undangan</h4>
              <p className="text-[10px] sm:text-xs break-all">
                {domain || window.location.origin}/undangan?to=nama-tamu
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-3 sm:px-6 py-2 sm:py-4 flex justify-end">
        <Button
          onClick={handleSaveDomain}
          disabled={!hasChanges || isSaving || isLoading}
          className="text-xs sm:text-sm h-8 sm:h-10"
          size="sm"
        >
          {isSaving && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          Simpan Pengaturan
        </Button>
      </CardFooter>
    </Card>
  );
}
