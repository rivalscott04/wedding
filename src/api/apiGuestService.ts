import { Guest } from '@/types/guest';

// Using proxy to avoid CORS issues

// Always use API, no localStorage fallback
const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`/api/wedding/guests/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add a timeout to avoid long waits
      signal: AbortSignal.timeout(3000)
    });
    if (!response.ok) {
      console.error('API check failed with status:', response.status);
      throw new Error(`API check failed with status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('API not available, but we will not fall back to localStorage:', error);
    throw new Error('API not available. Please check your server connection.');
  }
};

export const apiGuestService = {
  // Fetch all guests
  getGuests: async (): Promise<Guest[]> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      const response = await fetch(`/api/wedding/guests`);
      if (!response.ok) {
        throw new Error(`Failed to fetch guests: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Get a single guest by ID
  getGuestById: async (id: number): Promise<Guest | null> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      const response = await fetch(`/api/wedding/guests/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch guest: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching guest by ID:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Get a single guest by slug
  getGuestBySlug: async (slug: string): Promise<Guest | null> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      const response = await fetch(`/api/wedding/guests/slug/${slug}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch guest: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching guest by slug:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Get attendance statistics
  getAttendanceStats: async (): Promise<any> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      const response = await fetch(`/api/wedding/guests/stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance stats: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Add a single guest
  addGuest: async (guest: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      console.log('Sending guest data to API:', guest);

      const response = await fetch(`/api/wedding/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to add guest: ${response.status}`, errorText);
        throw new Error(`Failed to add guest: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      console.log('Guest added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding guest:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Update a guest
  updateGuest: async (guest: Guest): Promise<Guest> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      const response = await fetch(`/api/wedding/guests/${guest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to update guest: ${response.status}`, errorText);
        throw new Error(`Failed to update guest: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Mark guest as attended
  markAttended: async (id: number): Promise<Guest> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      const response = await fetch(`/api/wedding/guests/${id}/attend`, {
        method: 'PUT'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to mark guest as attended: ${response.status}`, errorText);
        throw new Error(`Failed to mark guest as attended: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking guest as attended:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Delete a guest
  deleteGuest: async (id: number): Promise<void> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      const response = await fetch(`/api/wedding/guests/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to delete guest: ${response.status}`, errorText);
        throw new Error(`Failed to delete guest: ${response.status}. ${errorText}`);
      }

      return;
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Import guests from CSV
  importGuests: async (guests: Omit<Guest, 'id' | 'created_at'>[]): Promise<void> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      console.log(`Importing ${guests.length} guests via API...`);

      // Import guests one by one since the API doesn't have a bulk import endpoint
      for (const guest of guests) {
        await apiGuestService.addGuest(guest);
      }

      console.log('All guests imported successfully');
      return;
    } catch (error) {
      console.error('Error importing guests:', error);
      throw error; // Propagate the error instead of falling back
    }
  },

  // Get guest count
  getGuestCount: async (): Promise<number> => {
    try {
      // Always use the API
      await isApiAvailable(); // This will throw if API is not available

      // Call the stats endpoint directly to avoid circular reference
      const response = await fetch(`/api/wedding/guests/stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance stats: ${response.status}`);
      }
      const stats = await response.json();
      return stats.total || 0;
    } catch (error) {
      console.error('Error getting guest count:', error);
      throw error; // Propagate the error instead of falling back
    }
  }
};
