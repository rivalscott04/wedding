import { Guest } from '@/types/guest';
import { query, isUsingLocalStorage } from '@/lib/db';
import { getLocalGuests, saveLocalGuests, generateId } from '@/data/mockData';

export const localGuestService = {
  // Fetch all guests
  getGuests: async (): Promise<Guest[]> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        return getLocalGuests();
      }

      const guests = await query(
        'SELECT * FROM guests ORDER BY created_at DESC',
        []
      ) as Guest[];

      return guests;
    } catch (error) {
      // Fallback to localStorage
      return getLocalGuests();
    }
  },

  // Get a single guest by slug
  getGuestBySlug: async (slug: string): Promise<Guest | null> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const guests = getLocalGuests();
        const guest = guests.find(g => g.slug === slug);
        return guest || null;
      }

      const guests = await query(
        'SELECT * FROM guests WHERE slug = ?',
        [slug]
      ) as Guest[];

      return guests.length > 0 ? guests[0] : null;
    } catch (error) {
      // Fallback to localStorage
      const guests = getLocalGuests();
      const guest = guests.find(g => g.slug === slug);
      return guest || null;
    }
  },

  // Add a single guest
  addGuest: async (guest: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const guests = getLocalGuests();
        const newGuest: Guest = {
          ...guest,
          id: generateId(),
          created_at: new Date().toISOString()
        };

        guests.push(newGuest);
        saveLocalGuests(guests);

        return newGuest;
      }

      const result = await query(
        'INSERT INTO guests (name, slug, phone_number, status) VALUES (?, ?, ?, ?)',
        [guest.name, guest.slug, guest.phone_number || '', guest.status || 'active']
      ) as { insertId: number };

      const newGuest = await query(
        'SELECT * FROM guests WHERE id = ?',
        [result.insertId]
      ) as Guest[];

      return newGuest[0];
    } catch (error) {
      // Fallback to localStorage
      const guests = getLocalGuests();
      const newGuest: Guest = {
        ...guest,
        id: generateId(),
        created_at: new Date().toISOString()
      };

      guests.push(newGuest);
      saveLocalGuests(guests);

      return newGuest;
    }
  },

  // Update a guest
  updateGuest: async (guest: Guest): Promise<Guest> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
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
      }

      await query(
        'UPDATE guests SET name = ?, slug = ?, phone_number = ?, status = ? WHERE id = ?',
        [guest.name, guest.slug, guest.phone_number || '', guest.status, guest.id]
      );

      const updatedGuest = await query(
        'SELECT * FROM guests WHERE id = ?',
        [guest.id]
      ) as Guest[];

      if (updatedGuest.length === 0) {
        throw new Error('Guest not found');
      }

      return updatedGuest[0];
    } catch (error) {
      // If it's a "Guest not found" error, rethrow it
      if (error instanceof Error && error.message === 'Guest not found') {
        throw error;
      }

      // Otherwise, fallback to localStorage
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
    }
  },

  // Update guest attendance by slug (string version)
  updateAttendance: async (slug: string, attendance: 'confirmed' | 'declined', notes?: string): Promise<Guest | null> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const guests = getLocalGuests();
        const index = guests.findIndex(g => g.slug === slug);

        if (index === -1) {
          return null;
        }

        guests[index] = {
          ...guests[index],
          attendance: attendance,
          attendance_date: new Date().toISOString(),
          attendance_notes: notes || '',
          updated_at: new Date().toISOString(),
          // Update status based on attendance
          status: attendance === 'confirmed' ? 'active' : 'inactive'
        };

        saveLocalGuests(guests);
        return guests[index];
      }

      const status = attendance === 'confirmed' ? 'active' : 'inactive';

      await query(
        `UPDATE guests
         SET attendance = ?,
             attendance_date = NOW(),
             attendance_notes = ?,
             status = ?
         WHERE slug = ?`,
        [attendance, notes || '', status, slug]
      );

      const updatedGuest = await query(
        'SELECT * FROM guests WHERE slug = ?',
        [slug]
      ) as Guest[];

      return updatedGuest.length > 0 ? updatedGuest[0] : null;
    } catch (error) {
      // Fallback to localStorage
      const guests = getLocalGuests();
      const index = guests.findIndex(g => g.slug === slug);

      if (index === -1) {
        return null;
      }

      guests[index] = {
        ...guests[index],
        attendance: attendance,
        attendance_date: new Date().toISOString(),
        attendance_notes: notes || '',
        updated_at: new Date().toISOString(),
        // Update status based on attendance
        status: attendance === 'confirmed' ? 'active' : 'inactive'
      };

      saveLocalGuests(guests);
      return guests[index];
    }
  },

  // Update guest attendance by slug (boolean version)
  updateAttendanceBoolean: async (slug: string, attended: boolean, notes?: string): Promise<Guest | null> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const guests = getLocalGuests();
        const index = guests.findIndex(g => g.slug === slug);

        if (index === -1) {
          return null;
        }

        guests[index] = {
          ...guests[index],
          attended: attended, // Boolean untuk kehadiran
          attendance_date: new Date().toISOString(),
          attendance_notes: notes || '',
          updated_at: new Date().toISOString(),
          // Update status based on attendance
          status: attended ? 'active' : 'inactive'
        };

        saveLocalGuests(guests);
        return guests[index];
      }

      const status = attended ? 'active' : 'inactive';

      // Gunakan format API yang benar sesuai dengan endpoint
      try {
        // Coba gunakan fetch API langsung untuk memastikan format yang benar
        const response = await fetch(`/api/wedding/guests/${slug}/attendance`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            attending: attended
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to update attendance: ${response.status}`);
        }

        const data = await response.json();
        console.log('Attendance updated successfully:', data);
        return data;
      } catch (apiError) {
        console.warn('API call failed, falling back to localStorage:', apiError);
        // Fall back to localStorage if API call fails
      }

      // Fallback to database query if fetch fails
      await query(
        `UPDATE guests
         SET attended = ?,
             attendance_date = NOW(),
             attendance_notes = ?,
             status = ?
         WHERE slug = ?`,
        [attended ? 1 : 0, notes || '', status, slug]
      );

      const updatedGuest = await query(
        'SELECT * FROM guests WHERE slug = ?',
        [slug]
      ) as Guest[];

      return updatedGuest.length > 0 ? updatedGuest[0] : null;
    } catch (error) {
      console.error('Error updating attendance (boolean):', error);

      // Fallback to localStorage
      const guests = getLocalGuests();
      const index = guests.findIndex(g => g.slug === slug);

      if (index === -1) {
        return null;
      }

      guests[index] = {
        ...guests[index],
        attended: attended,
        attendance_date: new Date().toISOString(),
        attendance_notes: notes || '',
        updated_at: new Date().toISOString(),
        // Update status based on attendance
        status: attended ? 'active' : 'inactive'
      };

      saveLocalGuests(guests);
      return guests[index];
    }
  },

  // Delete a guest
  deleteGuest: async (id: number): Promise<void> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const guests = getLocalGuests();
        const filteredGuests = guests.filter(g => g.id !== id);
        saveLocalGuests(filteredGuests);
        return;
      }

      await query(
        'DELETE FROM guests WHERE id = ?',
        [id]
      );
    } catch (error) {
      // Fallback to localStorage
      const guests = getLocalGuests();
      const filteredGuests = guests.filter(g => g.id !== id);
      saveLocalGuests(filteredGuests);
    }
  },

  // Import guests from CSV
  importGuests: async (guestsToImport: Omit<Guest, 'id' | 'created_at'>[]): Promise<void> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const guests = getLocalGuests();
        const timestamp = new Date().toISOString();

        const newGuests = guestsToImport.map((guest, index) => ({
          ...guest,
          id: generateId() + index,
          created_at: timestamp
        }));

        saveLocalGuests([...guests, ...newGuests]);
        return;
      }

      // Use a transaction for bulk insert
      const connection = await query('START TRANSACTION');

      for (const guest of guestsToImport) {
        await query(
          'INSERT INTO guests (name, slug, phone_number, status) VALUES (?, ?, ?, ?)',
          [guest.name, guest.slug, guest.phone_number || '', guest.status || 'active']
        );
      }

      await query('COMMIT');
    } catch (error) {
      // Try to rollback if possible
      try {
        if (!isUsingLocalStorage()) {
          await query('ROLLBACK');
        }
      } catch (rollbackError) {
        // Ignore rollback error
      }

      // Fallback to localStorage
      const guests = getLocalGuests();
      const timestamp = new Date().toISOString();

      const newGuests = guestsToImport.map((guest, index) => ({
        ...guest,
        id: generateId() + index,
        created_at: timestamp
      }));

      saveLocalGuests([...guests, ...newGuests]);
    }
  },

  // Get guest count
  getGuestCount: async (): Promise<number> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const guests = getLocalGuests();
        return guests.length;
      }

      const result = await query(
        'SELECT COUNT(*) as count FROM guests',
        []
      ) as [{ count: number }];

      return result[0].count;
    } catch (error) {
      // Fallback to localStorage
      const guests = getLocalGuests();
      return guests.length;
    }
  }
};
