
export interface Guest {
  id?: number;
  name: string;
  slug: string;
  phone_number?: string;
  status?: 'active' | 'inactive';
  attended?: boolean | number | null;
  attendance?: 'confirmed' | 'declined' | 'pending';
  attendance_date?: string;
  attendance_notes?: string;
  created_at?: string;
  updated_at?: string;
  isNewGuest?: boolean; // Properti untuk menandai tamu yang baru ditambahkan
}
