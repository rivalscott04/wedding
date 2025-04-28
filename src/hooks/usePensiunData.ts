
import { useState, useEffect } from "react";

interface Pegawai {
  nama: string;
}

interface PensiunData {
  id: number;
  nip: string;
  pegawai: Pegawai;
  tmt_pensiun: string;
  tempat_tugas: string;
  jenis_pensiun: string;
  status: string;
  file_sk: string | null;
}

// This is a mock data service - in a real app, you would fetch from an API
const mockData: PensiunData[] = [
  {
    id: 1,
    nip: "198504052010011001",
    pegawai: { nama: "Ahmad Firdaus" },
    tmt_pensiun: "2024-05-01",
    tempat_tugas: "Dinas Pendidikan",
    jenis_pensiun: "BUP",
    status: "Disetujui",
    file_sk: "document.pdf"
  },
  {
    id: 2,
    nip: "197606152006042004",
    pegawai: { nama: "Siti Nurhayati" },
    tmt_pensiun: "2024-06-15",
    tempat_tugas: "Dinas Kesehatan",
    jenis_pensiun: "APS",
    status: "Diproses",
    file_sk: null
  },
  {
    id: 3,
    nip: "198301232007011005",
    pegawai: { nama: "Budi Santoso" },
    tmt_pensiun: "2023-12-31",
    tempat_tugas: "Dinas Keuangan",
    jenis_pensiun: "Pensiun Dini",
    status: "Diajukan",
    file_sk: null
  },
  {
    id: 4,
    nip: "196503121990032001",
    pegawai: { nama: "Aisyah Putri" },
    tmt_pensiun: "2023-09-30",
    tempat_tugas: "Dinas Pertanian",
    jenis_pensiun: "Janda/Duda",
    status: "Ditolak",
    file_sk: null
  }
];

export function usePensiunData() {
  const [data, setData] = useState<PensiunData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call:
      // const response = await fetch('/api/pensiun');
      // const data = await response.json();
      
      setData(mockData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData
  };
}
