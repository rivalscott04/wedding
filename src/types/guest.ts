
export interface Guest {
  id?: number;
  name: string;
  slug: string;
  phone_number?: string;
  status?: 'active' | 'inactive';
  attendance?: 'confirmed' | 'declined' | 'pending';
  attendance_date?: string;
  attendance_notes?: string;
  created_at?: string;
  updated_at?: string;
}
