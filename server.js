// Server.js - Server untuk melayani aplikasi React di produksi dengan proxy API
// Gunakan dengan: node server.js

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';

// Dapatkan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Port dari environment variable atau default 8081
const PORT = process.env.PORT || 8081;

// API backend URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://data.rivaldev.site';
const API_PATH_PREFIX = '/api/wedding';

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

// Fungsi untuk meneruskan permintaan ke API backend
function proxyRequest(req, res) {
  const url = new URL(API_BASE_URL);
  const apiPath = req.url;

  console.log(`Proxying ${req.method} request to: ${API_BASE_URL}${apiPath}`);

  // Pilih protokol berdasarkan URL
  const requestFn = url.protocol === 'https:' ? httpsRequest : httpRequest;

  // Opsi untuk permintaan proxy
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: apiPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: url.hostname,
      'Origin': 'https://wedding.rivaldev.site',
      'Referer': 'https://wedding.rivaldev.site/'
    }
  };

  // Buat permintaan ke backend
  const proxyReq = requestFn(options, (proxyRes) => {
    console.log(`Proxy response status: ${proxyRes.statusCode}`);
    console.log(`Proxy response headers:`, proxyRes.headers);

    // Teruskan header dari backend ke client
    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    // Collect response data untuk logging
    let responseData = '';
    proxyRes.on('data', (chunk) => {
      responseData += chunk;
    });

    proxyRes.on('end', () => {
      if (proxyRes.statusCode >= 400) {
        console.error(`API Error Response (${proxyRes.statusCode}):`, responseData);
      } else {
        console.log(`API Success Response (${proxyRes.statusCode})`);
      }
    });

    // Teruskan body dari backend ke client
    proxyRes.pipe(res);
  });

  // Tangani error pada permintaan proxy
  proxyReq.on('error', (error) => {
    console.error('Proxy request error:', error);
    console.error('Request details:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      options: options
    });
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error: ' + error.message);
  });

  // Teruskan body dari client ke backend jika ada
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    // Jika ini adalah permintaan ke endpoint attendance yang diubah, modifikasi body
    if (req.url.includes('/guests/slug/') && req.url.includes('/attend')) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const newBody = {
            attended: data.attending !== undefined ? data.attending : data.attended,
            attendance: data.attending !== undefined
              ? (data.attending ? 'confirmed' : 'declined')
              : (data.attendance || (data.attended ? 'confirmed' : 'declined')),
            attendance_date: data.attendance_date || new Date().toISOString()
          };

          console.log('Original request body:', body);
          console.log('Modified request body:', JSON.stringify(newBody));

          // Set Content-Type header
          proxyReq.setHeader('Content-Type', 'application/json');

          // Set Content-Length header
          const modifiedBody = JSON.stringify(newBody);
          proxyReq.setHeader('Content-Length', Buffer.byteLength(modifiedBody));

          proxyReq.write(modifiedBody);
          proxyReq.end();
        } catch (error) {
          console.error('Error parsing/modifying request body:', error);
          req.pipe(proxyReq);
        }
      });
    } else {
      req.pipe(proxyReq);
    }
  } else {
    proxyReq.end();
  }
}

// Fungsi untuk menangani request
async function handleRequest(req, res) {
  console.log(`${req.method} ${req.url}`);

  // Tambahkan header CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');

  // Log request untuk debugging
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Headers:`, req.headers);

  // Tangani permintaan OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400' // 24 hours
    });
    res.end();
    return;
  }

  // Jika ini adalah permintaan API, teruskan ke backend
  if (req.url.startsWith(API_PATH_PREFIX)) {
    console.log(`Handling API request: ${req.method} ${req.url}`);

    // Jika ini adalah permintaan PUT ke endpoint attendance, ubah ke endpoint yang benar
    if (req.method === 'PUT' && req.url.includes('/guests/') && req.url.includes('/attendance')) {
      // Ubah format URL dari /api/wedding/guests/{slug}/attendance menjadi /api/wedding/guests/slug/{slug}/attend
      const originalUrl = req.url;
      const slugMatch = req.url.match(/\/guests\/([^\/]+)\/attendance/);

      if (slugMatch && slugMatch[1]) {
        const slug = slugMatch[1];
        req.url = `${API_PATH_PREFIX}/guests/slug/${slug}/attend`;
        console.log(`Rewriting URL from ${originalUrl} to ${req.url}`);
      }
    }

    // Log request details for debugging
    console.log('Request details:', {
      method: req.method,
      url: req.url,
      headers: {
        'content-type': req.headers['content-type'],
        'accept': req.headers['accept'],
        'origin': req.headers['origin'],
        'referer': req.headers['referer']
      }
    });

    proxyRequest(req, res);
    return;
  }

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
  console.log(`Proxying API requests to ${API_BASE_URL}`);
});
