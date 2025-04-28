import { createClient } from '@supabase/supabase-js';
import { Guest } from '@/types/guest';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!, 
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const guestService = {
  // Fetch all guests
  getGuests: async (): Promise<Guest[]> => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Guest[];
  },

  // Get a single guest by slug
  getGuestBySlug: async (slug: string): Promise<Guest | null> => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw error;
    }
    
    return data as Guest;
  },

  // Add a single guest
  addGuest: async (guest: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
    const { data, error } = await supabase
      .from('guests')
      .insert(guest)
      .select()
      .single();
    
    if (error) throw error;
    return data as Guest;
  },

  // Update a guest
  updateGuest: async (guest: Guest): Promise<Guest> => {
    const { data, error } = await supabase
      .from('guests')
      .update({
        name: guest.name,
        slug: guest.slug,
        status: guest.status
      })
      .eq('id', guest.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Guest;
  },

  // Delete a guest
  deleteGuest: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Import guests from CSV
  importGuests: async (guests: Omit<Guest, 'id' | 'created_at'>[]): Promise<void> => {
    const { error } = await supabase
      .from('guests')
      .insert(guests);
    
    if (error) throw error;
  },

  // Get guest count
  getGuestCount: async (): Promise<number> => {
    const { count, error } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }
};
