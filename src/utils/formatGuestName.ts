/**
 * Format nama tamu dari slug (mengganti tanda hubung dengan spasi dan kapitalisasi)
 * 
 * @param slug - Slug tamu (contoh: "ustadzah-oki")
 * @returns Nama tamu yang diformat (contoh: "Ustadzah Oki")
 */
export function formatGuestName(slug: string): string {
  if (!slug) return "Tamu Undangan";
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
