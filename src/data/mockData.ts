import { Guest } from '@/types/guest';
import { WeddingSettings, AppSettings } from '@/types/settings';
import { Message } from '@/types/message';

// Mock data for guests
export const mockGuests: Guest[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    slug: 'Budi Santoso', // Menggunakan nama asli
    phone_number: '6281234567890',
    status: 'active',
    attendance: 'confirmed',
    attendance_date: '2023-11-15T08:30:00',
    attendance_notes: 'Akan hadir bersama istri',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    slug: 'Siti Nurhaliza', // Menggunakan nama asli
    phone_number: '6285678901234',
    status: 'active',
    attendance: 'declined',
    attendance_date: '2023-11-14T14:20:00',
    attendance_notes: 'Mohon maaf tidak bisa hadir karena ada acara keluarga',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Keluarga Ahmad',
    slug: 'Keluarga Ahmad', // Menggunakan nama asli
    phone_number: '6287890123456',
    status: 'active',
    attendance: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Pak Direktur',
    slug: 'Pak Direktur', // Menggunakan nama asli
    phone_number: '6282345678901',
    status: 'active',
    attendance: 'confirmed',
    attendance_date: '2023-11-16T09:45:00',
    attendance_notes: 'Hadir bersama keluarga (4 orang)',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Ibu Kepala Sekolah',
    slug: 'Ibu Kepala Sekolah', // Menggunakan nama asli
    phone_number: '6289012345678',
    status: 'active',
    attendance: 'pending',
    created_at: new Date().toISOString()
  }
];

// Function to get guests from localStorage or use mock data if not available
export const getLocalGuests = (): Guest[] => {
  const storedGuests = localStorage.getItem('guests');
  if (storedGuests) {
    return JSON.parse(storedGuests);
  }

  // Initialize with mock data if nothing in localStorage
  localStorage.setItem('guests', JSON.stringify(mockGuests));
  return mockGuests;
};

// Function to save guests to localStorage
export const saveLocalGuests = (guests: Guest[]): void => {
  localStorage.setItem('guests', JSON.stringify(guests));
};

// Generate a unique ID for new guests
export const generateId = (): number => {
  const guests = getLocalGuests();
  const maxId = guests.reduce((max, guest) => Math.max(max, guest.id || 0), 0);
  return maxId + 1;
};

// Mock data for wedding settings
export const mockWeddingSettings: WeddingSettings = {
  id: 1,
  bride_name: 'Syahrina',
  groom_name: 'Rival',
  wedding_date: '2025-05-25T08:00:00',
  akad_time: '08:00 - 10:00 WIB',
  reception_time: '11:00 - 14:00 WIB',
  venue_name: 'Hotel Grand Ballroom',
  venue_address: 'Jl. Contoh No. 123, Jakarta Selatan',
  venue_map_link: 'https://maps.google.com/?q=-6.2088,106.8456',
  updated_at: new Date().toISOString()
};

// Mock data for app settings
export const mockAppSettings: AppSettings = {
  theme: 'light',
  music_enabled: true,
  show_gallery: true,
  show_countdown: true,
  show_wishes: true,
  rsvp_enabled: true
};

// Function to get wedding settings from localStorage or use mock data if not available
export const getLocalWeddingSettings = (): WeddingSettings => {
  const storedSettings = localStorage.getItem('weddingSettings');
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }

  // Initialize with mock data if nothing in localStorage
  localStorage.setItem('weddingSettings', JSON.stringify(mockWeddingSettings));
  return mockWeddingSettings;
};

// Function to save wedding settings to localStorage
export const saveLocalWeddingSettings = (settings: WeddingSettings): void => {
  localStorage.setItem('weddingSettings', JSON.stringify({
    ...settings,
    updated_at: new Date().toISOString()
  }));
};

// Function to get app settings from localStorage or use mock data if not available
export const getLocalAppSettings = (): AppSettings => {
  const storedSettings = localStorage.getItem('appSettings');
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }

  // Initialize with mock data if nothing in localStorage
  localStorage.setItem('appSettings', JSON.stringify(mockAppSettings));
  return mockAppSettings;
};

// Function to save app settings to localStorage
export const saveLocalAppSettings = (settings: AppSettings): void => {
  localStorage.setItem('appSettings', JSON.stringify(settings));
};

// Mock data for messages
export const mockMessages: Message[] = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    message: 'Selamat atas pernikahan kalian! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
    created_at: '2023-11-15T08:30:00'
  },
  {
    id: 2,
    name: 'Siti Aminah',
    message: 'Barakallahu laka wa baraka alaika wa jamaaa bainakumaa fii khair. Semoga Allah memberkahi kalian berdua dan menyatukan kalian dalam kebaikan.',
    created_at: '2023-11-14T14:20:00'
  },
  {
    id: 3,
    name: 'Keluarga Besar Soeharto',
    message: 'Selamat menempuh hidup baru! Semoga pernikahan kalian membawa keberkahan dan kebahagiaan.',
    created_at: '2023-11-13T09:45:00'
  }
];

// Function to get messages from localStorage or use mock data if not available
export const getLocalMessages = (): Message[] => {
  const storedMessages = localStorage.getItem('messages');
  if (storedMessages) {
    return JSON.parse(storedMessages);
  }

  // Initialize with mock data if nothing in localStorage
  localStorage.setItem('messages', JSON.stringify(mockMessages));
  return mockMessages;
};

// Function to save messages to localStorage
export const saveLocalMessages = (messages: Message[]): void => {
  localStorage.setItem('messages', JSON.stringify(messages));
};
