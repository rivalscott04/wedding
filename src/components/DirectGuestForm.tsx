import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-admin-toast';

// Komponen form langsung untuk menambahkan tamu
// Digunakan sebagai fallback jika metode API lain gagal
export function DirectGuestForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Nama tamu tidak boleh kosong",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Mengirim Data",
      description: "Menambahkan tamu dengan form submission langsung",
      variant: "info"
    });
    
    // Form akan di-submit langsung ke server
    // Tidak perlu kode tambahan di sini
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base">Tambah Tamu (Metode Alternatif)</CardTitle>
        <CardDescription className="text-xs">
          Gunakan form ini jika metode utama tidak berfungsi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          method="POST" 
          action="/api/wedding/guests" 
          encType="application/json"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <label htmlFor="direct-name" className="text-right text-xs">
                Nama
              </label>
              <div className="col-span-3">
                <Input
                  id="direct-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <label htmlFor="direct-phone" className="text-right text-xs">
                Nomor HP
              </label>
              <div className="col-span-3">
                <Input
                  id="direct-phone"
                  name="phone_number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>
            
            {/* Hidden fields */}
            <input type="hidden" name="slug" value={generateSlug(name)} />
            <input type="hidden" name="status" value="active" />
            
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="text-xs h-8">
                Tambah Tamu (Direct)
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
