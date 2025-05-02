
# Panduan Deployment ke VPS

Berikut ini adalah panduan untuk men-deploy aplikasi undangan pernikahan ke VPS Anda:

## Prasyarat

Pastikan VPS Anda sudah memiliki:
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Nginx atau Apache sebagai web server (opsional)
- SSL certificate (disarankan untuk menggunakan Let's Encrypt)

## Metode 1: Menggunakan Node.js Server

### Langkah 1: Build Aplikasi

1. Clone repositori ke VPS Anda:
```bash
git clone <URL_REPOSITORY_ANDA>
cd <NAMA_FOLDER_REPOSITORY>
```

2. Install dependensi:
```bash
npm install
```

3. Build aplikasi:
```bash
npm run build:prod
```

Hasil build akan tersimpan di folder `dist/`.

### Langkah 2: Jalankan Server

```bash
# Jalankan server Node.js sederhana
node server.js
```

Atau gunakan script npm:

```bash
npm run serve:dist
```

Aplikasi akan berjalan di port 8081 (atau port yang ditentukan di environment variable PORT).

## Metode 2: Menggunakan PM2 (Direkomendasikan)

PM2 adalah process manager untuk aplikasi Node.js yang memungkinkan aplikasi tetap berjalan di background dan restart otomatis jika terjadi crash.

### Langkah 1: Install PM2

```bash
npm install -g pm2
```

### Langkah 2: Build Aplikasi

```bash
# Install dependensi
npm install

# Build aplikasi untuk produksi
npm run build:prod
```

### Langkah 3: Jalankan dengan PM2

```bash
# Jalankan aplikasi dengan PM2
pm2 start ecosystem.config.js
```

### Perintah PM2 Lainnya

```bash
# Lihat status aplikasi
pm2 status

# Lihat log aplikasi
pm2 logs wedding-app

# Restart aplikasi
pm2 restart wedding-app

# Stop aplikasi
pm2 stop wedding-app

# Hapus aplikasi dari PM2
pm2 delete wedding-app

# Set PM2 untuk start otomatis saat server reboot
pm2 startup
pm2 save
```

## Metode 3: Konfigurasi Web Server (Nginx/Apache)

### Konfigurasi Nginx

Berikut contoh konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name wedding.rivaldev.site;

    # Redirect HTTP ke HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name wedding.rivaldev.site;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    root /var/www/html/wedding/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend server
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

### Konfigurasi Apache

Jika menggunakan Apache, gunakan konfigurasi berikut:

```apache
<VirtualHost *:80>
    ServerName wedding.rivaldev.site

    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName wedding.rivaldev.site

    DocumentRoot /var/www/html/wedding/dist

    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key

    <Directory /var/www/html/wedding/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Routing SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Cache static assets
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

### Langkah 3: Restart Web Server

Setelah melakukan konfigurasi web server, restart:

```bash
# Untuk Nginx
sudo systemctl restart nginx

# Untuk Apache
sudo systemctl restart apache2
```

## Metode 4: Menggunakan GitHub Actions (Opsional)

Jika Anda menggunakan GitHub, buat file `.github/workflows/deploy.yml` untuk auto-deploy:

   ```yaml
   name: Deploy to VPS

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: 18
       - name: Install dependencies
         run: npm ci
       - name: Build
         run: npm run build:prod
       - name: Deploy to VPS
         uses: appleboy/scp-action@master
         with:
           host: ${{ secrets.VPS_HOST }}
           username: ${{ secrets.VPS_USERNAME }}
           key: ${{ secrets.VPS_SSH_KEY }}
           source: "dist/"
           target: "/var/www/html/wedding"
   ```

## Tips Tambahan

### Monitoring

Pertimbangkan untuk memasang alat monitoring seperti PM2 atau UptimeRobot untuk memantau ketersediaan situs Anda.

### Backup

Lakukan backup rutin database (jika ada) dan file-file penting di VPS Anda.

### Keamanan

- Pastikan firewall dikonfigurasi dengan tepat
- Update sistem operasi dan software secara rutin
- Gunakan strong passwords dan ssh keys daripada password login

### Troubleshooting

Jika mengalami masalah saat menjalankan `npm run prod`:

1. Pastikan Node.js dan npm terinstal dengan benar:
   ```bash
   node -v
   npm -v
   ```

2. Pastikan semua dependensi terinstal:
   ```bash
   npm install
   ```

3. Coba build aplikasi terlebih dahulu:
   ```bash
   npm run build:prod
   ```

4. Jalankan server secara manual:
   ```bash
   node server.js
   ```

5. Periksa log untuk error:
   ```bash
   cat ~/.pm2/logs/wedding-app-error.log
   ```
