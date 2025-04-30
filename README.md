
# Digital Wedding Invitation

Aplikasi undangan pernikahan digital dengan fitur untuk mengelola tamu dan ucapan.

## Teknologi yang Digunakan

- Vite
- React 18
- TypeScript
- TailwindCSS 3.4
- React Router Dom 6
- Framer Motion 12.7
- shadcn/ui
- React Query

## Persyaratan Sistem

- Node.js versi 18 atau lebih baru
- npm atau yarn

## Langkah Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd digital-wedding
```

2. Install dependencies
```bash
npm install
```

3. Jalankan aplikasi dalam mode development
```bash
npm run dev
```

## Fitur Admin Panel

Admin panel dapat diakses melalui `/admin` dan menyediakan fitur-fitur berikut:

1. **Dashboard** - Ringkasan informasi tentang tamu undangan dan fitur lainnya
2. **Manajemen Tamu** - Mengelola daftar tamu undangan dengan fitur:
   - Tambah tamu baru
   - Import tamu dari file CSV
   - Edit dan hapus tamu
   - Salin link undangan
   - Bagikan undangan via WhatsApp
   - Melihat status konfirmasi kehadiran tamu
   - Mengelola status aktif/nonaktif berdasarkan konfirmasi kehadiran
3. **Pengaturan Acara** - Mengatur detail acara pernikahan:
   - Informasi pengantin (nama pengantin pria dan wanita)
   - Waktu acara (tanggal pernikahan, waktu akad, waktu resepsi)
   - Lokasi acara (nama tempat, alamat, link Google Maps)
4. **Pengaturan Aplikasi** - Mengkonfigurasi fitur-fitur undangan:
   - Tema tampilan (terang, gelap, otomatis)
   - Musik latar
   - Galeri foto
   - Hitung mundur
   - Ucapan dan doa
   - Konfirmasi kehadiran (RSVP)

## API Integration

Aplikasi ini menggunakan API untuk mengelola data tamu dan ucapan. Berikut adalah daftar endpoint yang digunakan:

### Guest Endpoints
- `GET /api/wedding/guests` - Mendapatkan semua tamu
- `GET /api/wedding/guests/:id` - Mendapatkan tamu berdasarkan ID
- `GET /api/wedding/guests/slug/:slug` - Mendapatkan tamu berdasarkan slug
- `GET /api/wedding/guests/stats` - Mendapatkan statistik kehadiran
- `POST /api/wedding/guests` - Membuat tamu baru
- `PUT /api/wedding/guests/:id` - Memperbarui tamu
- `PUT /api/wedding/guests/:id/attend` - Menandai tamu sebagai hadir
- `DELETE /api/wedding/guests/:id` - Menghapus tamu

### Message Endpoints
- `GET /api/wedding/messages` - Mendapatkan semua pesan
- `GET /api/wedding/messages/:id` - Mendapatkan pesan berdasarkan ID
- `GET /api/wedding/messages/guest/:guestId` - Mendapatkan pesan berdasarkan ID tamu
- `POST /api/wedding/messages` - Membuat pesan baru
- `PUT /api/wedding/messages/:id` - Memperbarui pesan
- `DELETE /api/wedding/messages/:id` - Menghapus pesan

## Perintah yang Tersedia

```bash
# Development server
npm run dev

# Build untuk production
npm run build

# Preview build hasil
npm run preview

# Type check
npm run typecheck

# Lint check
npm run lint

# Format code
npm run format
```

## Struktur Folder

```
src/
  ├── api/               # API services
  ├── components/        # Komponen React
  ├── data/              # Data lokal dan mock data
  ├── hooks/             # Custom React hooks
  ├── lib/               # Utilitas dan helpers
  ├── pages/             # Halaman utama
  ├── types/             # TypeScript types
  └── styles/            # CSS dan Tailwind styles
```

## Penggunaan

1. Admin menambahkan data tamu melalui interface di `/admin/guests`
2. Share link undangan dengan format: `https://domain.com/undangan?to={nama-tamu}`
   - Nama tamu digunakan apa adanya tanpa perubahan (tidak diubah menjadi slug)
   - Contoh: `https://domain.com/undangan?to=Keluarga%20Bapak%20Ahmad`
3. Tamu membuka link dan melihat undangan
4. Tamu dapat mengkonfirmasi kehadiran dengan mengklik tombol "InsyaAllah, Saya akan Hadir" atau "Mohon maaf, belum bisa hadir"
5. Status konfirmasi kehadiran tamu akan otomatis diperbarui di admin panel
6. Status aktif/nonaktif tamu akan otomatis diperbarui berdasarkan konfirmasi kehadiran:
   - Jika tamu mengkonfirmasi kehadiran, status akan menjadi "Aktif"
   - Jika tamu mengkonfirmasi ketidakhadiran, status akan menjadi "Nonaktif"
7. Tamu bisa memberikan ucapan dan doa

## Konfigurasi API

Untuk menggunakan API:

1. Buat file `.env` dengan konfigurasi API:
```
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Application Configuration
VITE_APP_NAME="Undangan Pernikahan"
VITE_APP_URL=http://localhost:8080
```

2. Pastikan server API berjalan di URL yang dikonfigurasi

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

#
