import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-admin-toast';
import config from '@/config/env';

// Tipe data untuk tamu
interface Guest {
  id: number;
  name: string;
  slug: string;
  status: string;
  attended: boolean;
  created_at?: string;
  updated_at?: string;
  phone_number?: string;
}

export default function AdminGuestData() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fungsi untuk mengambil data tamu langsung dari API
  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // URL API
      const apiUrl = `${config.apiBaseUrl}${config.apiWeddingPath}/guests`;
      console.log('Fetching guests from:', apiUrl);
      
      // Ambil data dengan fetch API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': config.isProduction ? config.appUrl : 'http://localhost:8081'
        },
        credentials: 'include'
      });
      
      console.log('API Response:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      // Parse response JSON
      const data = await response.json();
      console.log('Guest data:', data);
      
      // Pastikan data adalah array
      if (Array.isArray(data)) {
        setGuests(data);
        toast({
          title: "Data Berhasil Diambil",
          description: `Berhasil mengambil ${data.length} data tamu`,
          variant: "success"
        });
      } else {
        throw new Error('Data yang diterima bukan array');
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError(err.message || 'Gagal mengambil data tamu');
      toast({
        title: "Error",
        description: err.message || 'Gagal mengambil data tamu',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchGuests();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full px-4 py-6">
        <Card className="mb-8 shadow-sm">
          <CardHeader className="px-6 py-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Data Tamu Undangan (Direct API)</CardTitle>
            <Button 
              onClick={fetchGuests} 
              disabled={loading}
              variant="outline"
              size="sm"
              className="h-10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>{loading ? 'Memuat...' : 'Refresh'}</span>
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* Debug Info */}
            <div className="mb-4 p-4 bg-gray-50 rounded-md text-xs">
              <p><strong>API URL:</strong> {config.apiBaseUrl}{config.apiWeddingPath}/guests</p>
              <p><strong>Environment:</strong> {config.isProduction ? 'Production' : 'Development'}</p>
              <p><strong>Status:</strong> {loading ? 'Loading' : error ? 'Error' : 'Success'}</p>
              <p><strong>Guest Count:</strong> {guests.length}</p>
              {error && (
                <p className="text-red-600 mt-2"><strong>Error:</strong> {error}</p>
              )}
            </div>
            
            {/* Tabel Data Tamu */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kehadiran</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        Memuat data tamu...
                      </TableCell>
                    </TableRow>
                  ) : guests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        {error ? 'Gagal memuat data tamu' : 'Tidak ada data tamu'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>{guest.id}</TableCell>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell>{guest.slug}</TableCell>
                        <TableCell>{guest.status}</TableCell>
                        <TableCell>{guest.attended ? 'Hadir' : 'Belum'}</TableCell>
                        <TableCell>{guest.created_at ? new Date(guest.created_at).toLocaleString() : '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Raw Data */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Raw Data (JSON)</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
                {JSON.stringify(guests, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
