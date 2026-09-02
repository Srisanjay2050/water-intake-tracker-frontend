// API base URL is configured via the VITE_API_BASE_URL env var (see .env.example).
// A sensible localhost default keeps `npm run dev` working out of the box.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
