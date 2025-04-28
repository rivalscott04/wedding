import { getLocalGuests, saveLocalGuests } from '@/data/mockData';

/**
 * Fungsi untuk memperbaiki slug yang menggunakan tanda strip menjadi spasi
 * Ini diperlukan untuk memperbaiki data yang sudah tersimpan di localStorage
 * dengan format slug yang lama (menggunakan tanda strip)
 */
export const fixSlugs = (): void => {
  const guests = getLocalGuests();
  
  // Periksa apakah ada slug yang menggunakan tanda strip
  const needsFix = guests.some(guest => 
    guest.slug.includes('-') || 
    guest.slug.toLowerCase() !== guest.name.toLowerCase().trim()
  );
  
  if (needsFix) {
    // Perbaiki slug untuk semua tamu
    const fixedGuests = guests.map(guest => ({
      ...guest,
      slug: guest.name.trim() // Gunakan nama asli sebagai slug
    }));
    
    // Simpan kembali ke localStorage
    saveLocalGuests(fixedGuests);
    
    console.log('Slug tamu berhasil diperbaiki');
  }
};
