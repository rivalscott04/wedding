import axios from 'axios';
import { Guest } from '@/types/guest';
import config from '@/config/env';

// Buat instance axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}${config.apiWeddingPath}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 detik timeout
});

// Tambahkan interceptor untuk logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Full URL:', config.baseURL + config.url);
    if (config.data) {
      console.log('Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);

    // Log response data untuk debugging
    if (response.data) {
      console.log('Response Data:', response.data);
    }

    return response;
  },
  (error) => {
    if (error.response) {
      // Server merespons dengan status error
      console.error('API Response Error:', error.response.status, error.config?.url || 'Unknown URL');
      console.error('Error Data:', error.response.data);

      // Jika response berisi HTML, log untuk debugging
      if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
        console.error('Received HTML instead of JSON. First 500 chars:', error.response.data.substring(0, 500));
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons
      console.error('API No Response Error:', error.request);
    } else {
      // Error saat setup request
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Fungsi untuk mendapatkan semua tamu
export const getAllGuests = async () => {
  try {
    const response = await apiClient.get('/guests');
    return response.data;
  } catch (error) {
    console.error('Error getting guests:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan statistik kehadiran
export const getAttendanceStats = async () => {
  try {
    const response = await apiClient.get('/guests/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting attendance stats:', error);
    throw error;
  }
};

// Fungsi untuk menambah tamu baru
export const addGuest = async (data: Partial<Guest>) => {
  try {
    // Pastikan data yang dikirim sesuai dengan format yang diharapkan API
    const guestData = {
      name: data.name,
      slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-'),
      status: data.status || 'active',
      phone_number: data.phone_number || null,
      attended: data.attended || false
    };

    console.log('Sending guest data:', guestData);
    console.log('To URL:', `${apiClient.defaults.baseURL}/guests`);

    // Gunakan fetch API langsung untuk debugging
    const response = await fetch(`${config.apiBaseUrl}${config.apiWeddingPath}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(guestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText);
      console.error('Error response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
};

// Fungsi untuk mengupdate tamu
export const updateGuest = async (id: number, data: Partial<Guest>) => {
  try {
    const response = await apiClient.put(`/guests/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating guest:', error);
    throw error;
  }
};

// Fungsi untuk menghapus tamu
export const deleteGuest = async (id: number) => {
  try {
    const response = await apiClient.delete(`/guests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan tamu berdasarkan slug
export const getGuestBySlug = async (slug: string) => {
  try {
    const response = await apiClient.get(`/guests/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error getting guest by slug:', error);
    throw error;
  }
};

// Fungsi untuk mengupdate kehadiran tamu
export const updateAttendance = async (id: number, attendance: string, notes?: string) => {
  try {
    const response = await apiClient.patch(`/guests/${id}/attendance`, {
      attendance,
      attendance_notes: notes,
      attendance_date: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};

// Contoh penggunaan dengan data konkret
export const addTestGuest = async () => {
  try {
    const testGuest = {
      name: "Test Guest API " + new Date().toISOString().substring(0, 19),
      slug: "test-guest-api-" + Date.now(),
      status: "active",
      phone_number: "08123456789",
      attended: false
    };

    console.log('Test guest data:', testGuest);
    console.log('API URL:', `${config.apiBaseUrl}${config.apiWeddingPath}/guests`);

    // Gunakan fetch API langsung untuk debugging
    const response = await fetch(`${config.apiBaseUrl}${config.apiWeddingPath}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testGuest)
    });

    console.log('Test guest response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText);
      console.error('Error response:', errorText);

      // Cek apakah response berisi HTML
      if (errorText.includes('<!DOCTYPE')) {
        console.error('Received HTML instead of JSON');
        console.error('First 500 chars:', errorText.substring(0, 500));
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Test guest response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error in addTestGuest:', error);
    throw error;
  }
};
