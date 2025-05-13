import { Guest } from '@/types/guest';
import { axiosLike } from '@/lib/axiosUtils';

// Using proxy to avoid CORS issues

// Always use API, no localStorage fallback
const isApiAvailable = async (): Promise<boolean> => {
  try {
    console.log('Checking API availability...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`/api/wedding/guests/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('API check response status:', response.status);

    if (!response.ok) {
      console.error('API check failed with status:', response.status);
      throw new Error(`API check failed with status: ${response.status}`);
    }

    console.log('API is available');
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API check timed out after 3 seconds');
      throw new Error('API check timed out. Server might be down or slow to respond.');
    }

    console.error('API not available:', error);
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
      console.log('Request URL:', '/api/wedding/guests');

      // Log the stringified body for debugging
      const body = JSON.stringify(guest);
      console.log('Request body:', body);

      // Try using fetch first
      try {
        const response = await fetch(`/api/wedding/guests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to add guest: ${response.status}`, errorText);
          throw new Error(`Failed to add guest: ${response.status}. ${errorText}`);
        }

        const data = await response.json();
        console.log('Guest added successfully:', data);
        return data;
      } catch (fetchError) {
        // If fetch fails, try XMLHttpRequest as fallback
        console.warn('Fetch failed, trying XMLHttpRequest as fallback:', fetchError);

        try {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/wedding/guests', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function() {
              if (xhr.status >= 200 && xhr.status < 300) {
                console.log('XHR successful, status:', xhr.status);
                try {
                  const data = JSON.parse(xhr.responseText);
                  console.log('Guest added successfully via XHR:', data);
                  resolve(data);
                } catch (parseError) {
                  reject(new Error(`Failed to parse XHR response: ${parseError.message}`));
                }
              } else {
                console.error('XHR failed with status:', xhr.status, xhr.responseText);
                reject(new Error(`XHR failed with status: ${xhr.status}. ${xhr.responseText}`));
              }
            };

            xhr.onerror = function() {
              console.error('XHR network error');
              reject(new Error('Network error occurred while trying to add guest'));
            };

            xhr.send(body);
          });
        } catch (xhrError) {
          // If XMLHttpRequest also fails, try axiosLike as a last resort
          console.warn('XMLHttpRequest failed, trying axiosLike as last resort:', xhrError);

          try {
            const response = await axiosLike.post('/api/wedding/guests', guest);
            console.log('Guest added successfully via axiosLike:', response);
            return response;
          } catch (axiosError) {
            console.error('All methods failed to add guest:', axiosError);
            throw new Error('All API methods failed. Please check your network connection and server status.');
          }
        }
      }
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
      console.log('Fetching guest count...');

      try {
        // Gunakan fetch dengan timeout untuk menghindari hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        // Gunakan URL absolut untuk memastikan konsistensi dengan Postman
        const response = await fetch(`https://data.rivaldev.site/api/wedding/guests/stats`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        clearTimeout(timeoutId);

        console.log('Stats response status:', response.status);
        console.log('Stats response headers:', Object.fromEntries([...response.headers.entries()]));

        if (response.ok) {
          const statsText = await response.text();
          console.log('Raw stats response:', statsText);

          try {
            const stats = JSON.parse(statsText);
            console.log('Parsed guest stats response:', stats);

            // Handle different response formats
            if (stats.total !== undefined) {
              console.log('Using stats.total:', stats.total);
              return stats.total;
            } else if (stats.count !== undefined) {
              console.log('Using stats.count:', stats.count);
              return stats.count;
            } else if (Array.isArray(stats) && stats.length > 0 && stats[0].total !== undefined) {
              console.log('Using stats[0].total:', stats[0].total);
              return stats[0].total;
            } else {
              console.log('No recognized count format in stats:', stats);
            }
          } catch (parseError) {
            console.error('Error parsing stats response:', parseError);
          }
        } else {
          console.error('Stats response not OK:', response.status);
          const errorText = await response.text();
          console.error('Error response body:', errorText);
        }
      } catch (statsError) {
        console.warn('Error fetching stats, falling back to counting guests:', statsError);
      }

      // Fallback: count the guests manually
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const guestsResponse = await fetch(`https://data.rivaldev.site/api/wedding/guests`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        clearTimeout(timeoutId);

        if (guestsResponse.ok) {
          const guests = await guestsResponse.json();
          return Array.isArray(guests) ? guests.length : 0;
        }
      } catch (guestsError) {
        console.warn('Error fetching guests list:', guestsError);
      }

      // Final fallback: return a cached or default value
      console.warn('All API methods failed, returning default guest count');
      return 0; // Default value jika semua metode gagal
    } catch (error) {
      console.error('Error getting guest count:', error);
      return 0; // Return default value instead of throwing
    }
  }
};
