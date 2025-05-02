// Konfigurasi environment untuk aplikasi
const config = {
  // Base URL untuk API, menggunakan environment variable atau fallback ke localhost
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

  // Nama aplikasi
  appName: import.meta.env.VITE_APP_NAME || 'Undangan Pernikahan',

  // URL aplikasi
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:8081',

  // Cek apakah aplikasi berjalan di production
  isProduction: import.meta.env.MODE === 'production',

  // Path API untuk wedding - di production menggunakan /api/wedding
  apiWeddingPath: '/api/wedding'
};

export default config;
