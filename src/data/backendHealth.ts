// Production default; local dev can target localhost:8080 without changing source.
export const BACKEND_API_BASE_URL = (
  import.meta.env?.VITE_BACKEND_API_BASE_URL || 'https://api.nguyendodinhphuong.name.vn/api/v1'
).replace(/\/+$/, '');
