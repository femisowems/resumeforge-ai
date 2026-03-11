export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/api/${cleanPath}`;
};
