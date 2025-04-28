export interface Message {
  id: number;
  name: string;
  message: string;
  guest_id?: number;
  created_at: string;
}
