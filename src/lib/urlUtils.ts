import { getDomain } from '@/services/settingsService';

// Fungsi untuk mendapatkan base URL (domain kustom atau default)
export async function getBaseUrl(): Promise<string> {
  try {
    const domain = await getDomain();
    return domain || window.location.origin;
  } catch (error) {
    console.error('Error getting domain setting:', error);
    return window.location.origin;
  }
}

// Fungsi untuk membuat URL undangan dengan slug tamu
export async function createInvitationUrl(slug: string): Promise<string> {
  const baseUrl = await getBaseUrl();
  return `${baseUrl}/undangan?to=${encodeURIComponent(slug)}`;
}

// Fungsi untuk membuat URL WhatsApp dengan pesan undangan
export async function createWhatsAppUrl(phoneNumber: string, message: string): Promise<string> {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

// Fungsi untuk membuat pesan undangan lengkap
export async function createInvitationMessage(guestName: string, slug: string): Promise<string> {
  const baseUrl = await getBaseUrl();
  const invitationLink = await createInvitationUrl(slug);

  // PENTING: URL harus berada di baris pertama tanpa teks lain agar preview gambar muncul
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nKepada Yth.\nBapak/Ibu/Saudara/i\n${guestName}\n\nDengan penuh kebahagiaan dan tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dalam acara pernikahan kami yang akan segera dilangsungkan. Kehadiran Anda akan menjadi kebahagiaan tersendiri bagi kami.\n\nUntuk informasi lebih lanjut mengenai acara dan konfirmasi kehadiran, silakan klik link berikut:\n${invitationLink}\n\nSemoga Allah SWT senantiasa memberkahi kita semua dengan kebahagiaan dan kedamaian. Terima kasih atas perhatian dan doanya. Kami berharap bisa berbagi kebahagiaan ini bersama Anda. 😊\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh,\nKedua Keluarga Yang Berbahagia`;
}
