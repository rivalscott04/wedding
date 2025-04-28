export interface WeddingSettings {
  id?: number;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  akad_time: string;
  reception_time: string;
  venue_name: string;
  venue_address: string;
  venue_map_link?: string;
  updated_at?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  music_enabled: boolean;
  show_gallery: boolean;
  show_countdown: boolean;
  show_wishes: boolean;
  rsvp_enabled: boolean;
}
