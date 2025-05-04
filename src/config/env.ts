// Konfigurasi environment untuk aplikasi
const config = {
  // Base URL untuk API, menggunakan environment variable atau fallback ke data.rivaldev.site
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://data.rivaldev.site',

  // Nama aplikasi
  appName: import.meta.env.VITE_APP_NAME || 'Undangan Pernikahan',

  // URL aplikasi
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:8081',

  // Cek apakah aplikasi berjalan di production
  isProduction: import.meta.env.MODE === 'production',

  // Path API untuk wedding - selalu menggunakan /api/wedding
  apiWeddingPath: '/api/wedding',

  // URL API lengkap (untuk debugging)
  get fullApiUrl() {
    return `${this.apiBaseUrl}${this.apiWeddingPath}`;
  }
};

export default config;
