
# Panduan Deployment ke VPS

Berikut ini adalah panduan untuk men-deploy aplikasi undangan pernikahan ke VPS Anda:

## Prasyarat

Pastikan VPS Anda sudah memiliki:
- Node.js (versi 18 atau lebih baru)
- npm atau yarn 
- Nginx atau Apache sebagai web server
- SSL certificate (disarankan untuk menggunakan Let's Encrypt)

## Langkah 1: Build Aplikasi

1. Clone repositori ke VPS Anda:
```bash
git clone <URL_REPOSITORY_ANDA>
cd <NAMA_FOLDER_REPOSITORY>
```

2. Install dependensi:
```bash
npm install
# ATAU
yarn
```

3. Build aplikasi:
```bash
npm run build
# ATAU
yarn build
```

Hasil build akan tersimpan di folder `dist/`.

## Langkah 2: Konfigurasi Web Server

### Konfigurasi Nginx

Berikut contoh konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP ke HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    root /path/to/your/repo/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
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
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    DocumentRoot /path/to/your/repo/dist
    
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    
    <Directory /path/to/your/repo/dist>
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

## Langkah 3: Restart Web Server

Setelah melakukan konfigurasi web server, restart:

```bash
# Untuk Nginx
sudo systemctl restart nginx

# Untuk Apache
sudo systemctl restart apache2
```

## Tips Tambahan

1. **Auto-deploy dengan GitHub Actions**

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
         run: npm run build
       - name: Deploy to VPS
         uses: appleboy/scp-action@master
         with:
           host: ${{ secrets.VPS_HOST }}
           username: ${{ secrets.VPS_USERNAME }}
           key: ${{ secrets.VPS_SSH_KEY }}
           source: "dist/"
           target: "/path/to/your/webroot"
   ```

2. **Monitoring**

   Pertimbangkan untuk memasang alat monitoring seperti PM2 atau UptimeRobot untuk memantau ketersediaan situs Anda.

3. **Backup**

   Lakukan backup rutin database (jika ada) dan file-file penting di VPS Anda.

4. **Keamanan**

   - Pastikan firewall dikonfigurasi dengan tepat
   - Update sistem operasi dan software secara rutin
   - Gunakan strong passwords dan ssh keys daripada password login
