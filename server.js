// Server.js - Server sederhana untuk melayani aplikasi React di produksi
// Gunakan dengan: node server.js

// Versi sederhana tanpa dependensi tambahan
// Ini akan bekerja tanpa perlu menginstal express

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

// Dapatkan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Port dari environment variable atau default 8081
const PORT = process.env.PORT || 8081;

// Mapping tipe MIME
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.txt': 'text/plain',
};

// Direktori dist
const DIST_DIR = join(__dirname, 'dist');

// Fungsi untuk menangani request
async function handleRequest(req, res) {
  console.log(`${req.method} ${req.url}`);

  try {
    // Dapatkan path dari URL
    let path = req.url;

    // Hapus query string jika ada
    const queryIndex = path.indexOf('?');
    if (queryIndex !== -1) {
      path = path.substring(0, queryIndex);
    }

    // Jika path adalah root atau tidak memiliki ekstensi, gunakan index.html
    if (path === '/' || !extname(path)) {
      path = '/index.html';
    }

    // Buat path lengkap ke file
    const filePath = join(DIST_DIR, path);

    // Baca file
    const content = await readFile(filePath);

    // Set header Content-Type berdasarkan ekstensi file
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Kirim response
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);

  } catch (error) {
    console.error(`Error serving ${req.url}:`, error);

    // Jika file tidak ditemukan, coba serve index.html (untuk SPA routing)
    if (error.code === 'ENOENT') {
      try {
        const indexPath = join(DIST_DIR, 'index.html');
        const content = await readFile(indexPath);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
        return;
      } catch (indexError) {
        console.error('Error serving index.html:', indexError);
      }
    }

    // Jika masih error, kirim 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Buat server
const server = createServer(handleRequest);

// Jalankan server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from ${DIST_DIR}`);
});
