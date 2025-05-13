import axios from 'axios';
import { Guest } from '@/types/guest';
import config from '@/config/env';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: `${config.apiBaseUrl}${config.apiWeddingPath}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': config.isProduction ? config.appUrl : 'http://localhost:8081'
  },
  timeout: 10000, // 10 detik timeout
  validateStatus: function (status) {
    // Terima semua status code untuk debugging
    return true;
  },
  withCredentials: true, // Kirim cookies jika diperlukan
});

// Log konfigurasi untuk debugging
console.log('Axios Guest Service Configuration:');
console.log('- Base URL:', config.apiBaseUrl);
console.log('- API Path:', config.apiWeddingPath);
console.log('- Full URL:', `${config.apiBaseUrl}${config.apiWeddingPath}`);
console.log('- Environment:', config.isProduction ? 'Production' : 'Development');

// Tambahkan interceptor untuk logging
api.interceptors.request.use(
  (config) => {
    console.log('Axios Request:', config.method?.toUpperCase(), config.url);
    if (config.data) {
      console.log('Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', response.status, response.statusText);

    // Log response data untuk debugging
    if (response.data) {
      console.log('Response Data:', response.data);
    }

    // Jika status code error, log lebih detail
    if (response.status >= 400) {
      console.error('Error Response:', response.status, response.statusText);
      console.error('Response Data:', response.data);
      console.error('Response Headers:', response.headers);

      // Jika response berisi HTML, log untuk debugging
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE')) {
        console.error('Received HTML instead of JSON. First 500 chars:', response.data.substring(0, 500));
      }
    }

    return response;
  },
  (error) => {
    if (error.response) {
      // Server merespons dengan status error
      console.error('Axios Response Error:', error.response.status, error.response.statusText);
      console.error('Error Data:', error.response.data);

      // Jika response berisi HTML, log untuk debugging
      if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
        console.error('Received HTML instead of JSON. First 500 chars:', error.response.data.substring(0, 500));
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons
      console.error('Axios No Response Error:', error.request);
    } else {
      // Error saat setup request
      console.error('Axios Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const axiosGuestService = {
  // Fetch all guests
  getGuests: async (): Promise<Guest[]> => {
    try {
      console.log('Fetching guests from:', `${api.defaults.baseURL}/guests`);

      // Gunakan fetch API langsung untuk debugging
      const response = await fetch(`${config.apiBaseUrl}${config.apiWeddingPath}/guests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': config.isProduction ? config.appUrl : 'http://localhost:8081'
        },
        credentials: 'include' // Kirim cookies jika diperlukan
      });

      console.log('Fetch response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching guests:', errorText);
        throw new Error(`Failed to fetch guests: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched guests data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  },

  // Get a single guest by ID
  getGuestById: async (id: number): Promise<Guest | null> => {
    try {
      const response = await api.get(`/guests/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching guest by ID:', error);
      throw error;
    }
  },

  // Get a single guest by slug
  getGuestBySlug: async (slug: string): Promise<Guest | null> => {
    try {
      // Tambahkan timestamp untuk mencegah caching
      const timestamp = new Date().getTime();
      console.log(`Validating guest with slug: ${slug} at ${timestamp}`);

      // Gunakan URL relatif untuk memanfaatkan proxy Vite
      const apiUrl = config.isProduction
        ? `${config.apiBaseUrl}${config.apiWeddingPath}/guests/slug/${slug}?_t=${timestamp}`
        : `/api/wedding/guests/slug/${slug}?_t=${timestamp}`;

      console.log(`Using API URL: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log(`Validation response status: ${response.status}`);

      if (response.status === 404) {
        console.log(`Guest with slug ${slug} not found`);
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to validate guest: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Guest validation successful:`, data);
      return data;
    } catch (error) {
      console.error('Error fetching guest by slug:', error);
      // Jika terjadi error, anggap tamu tidak valid
      return null;
    }
  },

  // Get attendance statistics
  getAttendanceStats: async (): Promise<any> => {
    try {
      const response = await api.get('/guests/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  },

  // Add a single guest
  addGuest: async (guest: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
    try {
      // Format data sesuai dengan contoh yang diberikan
      const guestData = {
        name: guest.name,
        slug: guest.slug || guest.name.toLowerCase().replace(/\s+/g, '-'),
        status: guest.status || 'active',
        attended: guest.attended === undefined ? 0 : guest.attended, // Default: 0 (belum konfirmasi)
        // created_at dan updated_at akan ditambahkan oleh server
      };

      console.log('Adding guest with Axios (formatted):', guestData);
      const response = await api.post('/guests', guestData);
      console.log('Guest added successfully with Axios:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding guest with Axios:', error);
      throw error;
    }
  },

  // Update a guest
  updateGuest: async (guest: Guest): Promise<Guest> => {
    try {
      const response = await api.put(`/guests/${guest.id}`, guest);
      return response.data;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  },

  // Mark guest as attended
  markAttended: async (id: number): Promise<Guest> => {
    try {
      const response = await api.put(`/guests/${id}/attend`);
      return response.data;
    } catch (error) {
      console.error('Error marking guest as attended:', error);
      throw error;
    }
  },

  // Delete a guest
  deleteGuest: async (id: number): Promise<void> => {
    try {
      await api.delete(`/guests/${id}`);
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  },

  // Import guests from CSV
  importGuests: async (guests: Omit<Guest, 'id' | 'created_at'>[]): Promise<void> => {
    try {
      console.log(`Importing ${guests.length} guests via Axios...`);

      // Import guests one by one since the API doesn't have a bulk import endpoint
      for (const guest of guests) {
        await axiosGuestService.addGuest(guest);
      }

      console.log('All guests imported successfully');
    } catch (error) {
      console.error('Error importing guests:', error);
      throw error;
    }
  },

  // Get guest count
  getGuestCount: async (): Promise<number> => {
    try {
      const stats = await axiosGuestService.getAttendanceStats();
      return stats.total || 0;
    } catch (error) {
      console.error('Error getting guest count:', error);
      throw error;
    }
  }
};
