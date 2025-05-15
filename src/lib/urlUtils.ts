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

  // Kembali ke format sebelumnya tanpa URL di baris pertama
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nKepada Yth.\nBapak/Ibu/Saudara/i \n\n*${guestName}*\n\nDengan segala hormat dan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi saksi kebahagiaan kami dalam acara pernikahan yang insyaAllah akan dilangsungkan dalam waktu dekat.\n\nKehadiran dan doa restu dari Bapak/Ibu/Saudara/i akan menjadi hadiah terindah serta kenangan bermakna dalam lembaran baru perjalanan kami.\n\nUntuk detail acara dan konfirmasi kehadiran, silakan klik tautan berikut:\n\n${invitationLink}\n\nSemoga Allah SWT senantiasa melimpahkan cinta, keberkahan, dan kebahagiaan kepada kita semua.\nTerima kasih atas perhatian dan doa yang tulus.\nKami sangat menantikan kehadiran Bapak/Ibu/Saudara/i di hari bahagia kami. 😊\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh,\nKami yang berbahagia,\nKedua Keluarga Besar`;
}
