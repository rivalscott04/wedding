
// Mock guest list data
const guestList = [
  "Pak Budi",
  "Ibu Siti",
  "Keluarga Suharto",
  "Bapak/Ibu Ahmad",
  "Keluarga Besar Sutanto",
  "Pak Direktur",
  "Ibu Kepala Sekolah",
  "Bapak/Ibu Dosen",
  "Teman-teman Angkatan 2015",
  "Alumni SMA 5"
];

// Function to validate if a guest is on the list
export const validateGuest = (name: string): boolean => {
  if (!name) return false;
  
  const normalizedName = name.trim().toLowerCase();
  
  return guestList.some(guest => 
    guest.toLowerCase().includes(normalizedName) || 
    normalizedName.includes(guest.toLowerCase())
  );
};
