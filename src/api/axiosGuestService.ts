import axios from 'axios';
import { Guest } from '@/types/guest';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: '/api/wedding',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 detik timeout
});

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
    return response;
  },
  (error) => {
    if (error.response) {
      // Server merespons dengan status error
      console.error('Axios Response Error:', error.response.status, error.response.statusText);
      console.error('Error Data:', error.response.data);
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
      const response = await api.get('/guests');
      return response.data;
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
      const response = await api.get(`/guests/slug/${slug}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching guest by slug:', error);
      throw error;
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
      console.log('Adding guest with Axios:', guest);
      const response = await api.post('/guests', guest);
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
