
export interface Guest {
  id?: number;
  name: string;
  slug: string;
  phone_number?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface GuestResponse {
  success: boolean;
  data?: Guest[];
  message?: string;
}
