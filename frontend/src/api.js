// Konfigurasi URL backend terpusat.
// Di development: pakai http://localhost:5001
// Di production: pakai URL Railway dari env variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default API_BASE_URL;
