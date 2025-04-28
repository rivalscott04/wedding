# Panduan Admin Panel Undangan Pernikahan

Dokumen ini berisi panduan penggunaan panel admin untuk mengelola undangan pernikahan digital.

## Akses Admin Panel

Akses panel admin melalui URL berikut:
```
https://your-domain.com/admin
```

## Fitur-fitur Admin Panel

### 1. Dashboard

Dashboard menampilkan ringkasan informasi penting:
- Jumlah tamu undangan
- Jumlah ucapan dan doa
- Status RSVP
- Pengaturan acara

### 2. Manajemen Tamu

Halaman ini digunakan untuk mengelola daftar tamu undangan:

#### Menambahkan Tamu Baru
1. Masukkan nama tamu pada kolom input
2. Klik tombol "Tambah Tamu"
3. Sistem akan otomatis membuat slug URL untuk tamu tersebut

#### Import Tamu dari CSV
1. Siapkan file CSV dengan format: kolom pertama adalah nama tamu
2. Klik tombol "Import CSV"
3. Pilih file CSV yang telah disiapkan
4. Sistem akan mengimpor semua tamu dari file CSV

#### Mengedit Tamu
1. Klik ikon edit (pensil) pada baris tamu yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik "Simpan Perubahan"

#### Menghapus Tamu
1. Klik ikon hapus (tempat sampah) pada baris tamu yang ingin dihapus
2. Konfirmasi penghapusan

#### Membagikan Undangan
1. Klik ikon salin (copy) untuk menyalin link undangan
2. Klik ikon bagikan (share) untuk membagikan undangan via WhatsApp

### 3. Format URL Undangan

Format URL undangan untuk setiap tamu adalah:
```
https://your-domain.com/undangan?to=nama-tamu
```

Dimana `nama-tamu` adalah slug yang dibuat otomatis dari nama tamu.

### 4. Template Pesan WhatsApp

Berikut adalah template pesan WhatsApp yang digunakan:

```
Assalamu'alaikum Warahmatullahi Wabarakatuh,

Bapak/Ibu [Nama Tamu]

Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dalam acara pernikahan kami yang akan segera dilangsungkan. Kehadiran Anda akan menjadi kebahagiaan tersendiri bagi kami.

Untuk informasi lebih lanjut mengenai acara dan konfirmasi kehadiran, silakan klik link berikut:
[Link Undangan]

Semoga Allah SWT senantiasa memberkahi kita semua dengan kebahagiaan dan kedamaian. Terima kasih atas perhatian dan doanya. Kami berharap bisa berbagi kebahagiaan ini bersama Anda. 😊

Wassalamu'alaikum Warahmatullahi Wabarakatuh,
Rival & Syahrina
```

Template ini akan otomatis mengisi:
- Nama tamu sesuai dengan data yang diinput
- Link undangan yang unik untuk setiap tamu

## Database

### Struktur Tabel Guests

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(255) | Nama tamu |
| slug | VARCHAR(255) | Versi URL-friendly dari nama |
| status | ENUM('active', 'inactive') | Status tamu |
| attended | BOOLEAN | Apakah tamu hadir |
| created_at | TIMESTAMP | Waktu pembuatan record |
| updated_at | TIMESTAMP | Waktu update record |

## Tips Penggunaan

1. **Penamaan Tamu**:
   - Gunakan nama lengkap untuk memudahkan identifikasi
   - Untuk keluarga, bisa menggunakan format "Keluarga Besar Bapak/Ibu [Nama]"

2. **Penggunaan CSV**:
   - Format CSV harus memiliki header di baris pertama
   - Kolom pertama harus berisi nama tamu
   - Contoh format CSV:
     ```
     Nama
     Budi Santoso
     Keluarga Ahmad
     Ibu Siti
     ```

3. **Pengelolaan Status Tamu**:
   - Status "Aktif" berarti tamu dapat mengakses undangan
   - Status "Nonaktif" dapat digunakan untuk menonaktifkan akses sementara

4. **Backup Data**:
   - Lakukan backup database secara berkala
   - Ekspor daftar tamu ke CSV sebagai cadangan
