import { Guest } from '@/types/guest';
import { getLocalGuests, saveLocalGuests, generateId } from '@/data/mockData';

// Using proxy to avoid CORS issues

// Check if API is available
const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`/api/wedding/guests/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add a timeout to avoid long waits
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.warn('API not available, falling back to localStorage:', error);
    return false;
  }
};

export const apiGuestService = {
  // Fetch all guests
  getGuests: async (): Promise<Guest[]> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests`);
          if (!response.ok) {
            throw new Error(`Failed to fetch guests: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for getGuests');
      return getLocalGuests();
    } catch (error) {
      console.error('Error fetching guests:', error);
      // Fallback to localStorage in case of any error
      return getLocalGuests();
    }
  },

  // Get a single guest by ID
  getGuestById: async (id: number): Promise<Guest | null> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests/${id}`);
          if (response.status === 404) {
            return null;
          }
          if (!response.ok) {
            throw new Error(`Failed to fetch guest: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for getGuestById');
      const guests = getLocalGuests();
      const guest = guests.find(g => g.id === id);
      return guest || null;
    } catch (error) {
      console.error('Error fetching guest by ID:', error);
      // Fallback to localStorage in case of any error
      const guests = getLocalGuests();
      const guest = guests.find(g => g.id === id);
      return guest || null;
    }
  },

  // Get a single guest by slug
  getGuestBySlug: async (slug: string): Promise<Guest | null> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests/slug/${slug}`);
          if (response.status === 404) {
            return null;
          }
          if (!response.ok) {
            throw new Error(`Failed to fetch guest: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for getGuestBySlug');
      const guests = getLocalGuests();
      const guest = guests.find(g => g.slug === slug);
      return guest || null;
    } catch (error) {
      console.error('Error fetching guest by slug:', error);
      // Fallback to localStorage in case of any error
      const guests = getLocalGuests();
      const guest = guests.find(g => g.slug === slug);
      return guest || null;
    }
  },

  // Get attendance statistics
  getAttendanceStats: async (): Promise<any> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests/stats`);
          if (!response.ok) {
            throw new Error(`Failed to fetch attendance stats: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for getAttendanceStats');
      const guests = getLocalGuests();
      const totalGuests = guests.length;
      const attendedGuests = guests.filter(g => g.attendance === 'confirmed').length;
      const activeGuests = guests.filter(g => g.status === 'active').length;

      return {
        total: totalGuests,
        attended: attendedGuests,
        active: activeGuests,
        attendanceRate: totalGuests > 0 ? (attendedGuests / totalGuests * 100).toFixed(2) : 0
      };
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      // Fallback to localStorage in case of any error
      const guests = getLocalGuests();
      const totalGuests = guests.length;
      const attendedGuests = guests.filter(g => g.attendance === 'confirmed').length;
      const activeGuests = guests.filter(g => g.status === 'active').length;

      return {
        total: totalGuests,
        attended: attendedGuests,
        active: activeGuests,
        attendanceRate: totalGuests > 0 ? (attendedGuests / totalGuests * 100).toFixed(2) : 0
      };
    }
  },

  // Add a single guest
  addGuest: async (guest: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(guest)
          });
          if (!response.ok) {
            throw new Error(`Failed to add guest: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for addGuest');
      const guests = getLocalGuests();
      const newGuest: Guest = {
        ...guest,
        id: generateId(),
        created_at: new Date().toISOString()
      };

      guests.push(newGuest);
      saveLocalGuests(guests);

      return newGuest;
    } catch (error) {
      console.error('Error adding guest:', error);
      throw error;
    }
  },

  // Update a guest
  updateGuest: async (guest: Guest): Promise<Guest> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests/${guest.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(guest)
          });
          if (!response.ok) {
            throw new Error(`Failed to update guest: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for updateGuest');
      const guests = getLocalGuests();
      const index = guests.findIndex(g => g.id === guest.id);

      if (index === -1) {
        throw new Error('Guest not found');
      }

      guests[index] = {
        ...guest,
        updated_at: new Date().toISOString()
      };

      saveLocalGuests(guests);
      return guests[index];
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  },

  // Mark guest as attended
  markAttended: async (id: number): Promise<Guest> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests/${id}/attend`, {
            method: 'PUT'
          });
          if (!response.ok) {
            throw new Error(`Failed to mark guest as attended: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for markAttended');
      const guests = getLocalGuests();
      const index = guests.findIndex(g => g.id === id);

      if (index === -1) {
        throw new Error('Guest not found');
      }

      guests[index] = {
        ...guests[index],
        attendance: 'confirmed',
        attendance_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      saveLocalGuests(guests);
      return guests[index];
    } catch (error) {
      console.error('Error marking guest as attended:', error);
      throw error;
    }
  },

  // Delete a guest
  deleteGuest: async (id: number): Promise<void> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/guests/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            throw new Error(`Failed to delete guest: ${response.status}`);
          }
          return;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for deleteGuest');
      const guests = getLocalGuests();
      const index = guests.findIndex(g => g.id === id);

      if (index === -1) {
        throw new Error('Guest not found');
      }

      guests.splice(index, 1);
      saveLocalGuests(guests);
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  },

  // Import guests from CSV
  importGuests: async (guests: Omit<Guest, 'id' | 'created_at'>[]): Promise<void> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          // Import guests one by one since the API doesn't have a bulk import endpoint
          for (const guest of guests) {
            await apiGuestService.addGuest(guest);
          }
          return;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for importGuests');
      const existingGuests = getLocalGuests();
      const timestamp = new Date().toISOString();

      const newGuests = guests.map((guest, index) => ({
        ...guest,
        id: generateId() + index,
        created_at: timestamp
      }));

      saveLocalGuests([...existingGuests, ...newGuests]);
    } catch (error) {
      console.error('Error importing guests:', error);
      throw error;
    }
  },

  // Get guest count
  getGuestCount: async (): Promise<number> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          // Call the stats endpoint directly to avoid circular reference
          const response = await fetch(`/api/wedding/guests/stats`);
          if (!response.ok) {
            throw new Error(`Failed to fetch attendance stats: ${response.status}`);
          }
          const stats = await response.json();
          return stats.total || 0;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for getGuestCount');
      const guests = getLocalGuests();
      return guests.length;
    } catch (error) {
      console.error('Error getting guest count:', error);
      // Fallback to localStorage in case of any error
      const guests = getLocalGuests();
      return guests.length;
    }
  }
};
