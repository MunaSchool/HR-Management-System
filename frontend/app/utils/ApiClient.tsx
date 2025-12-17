// utils/axiosInstance.ts
"use client";
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true, // Include cookies if needed
});
// This variable will hold the function that AuthContext gives us
let onUnAuthenticated: (() => void);
// AuthContext will call this later
export function registerUnauthenticatedHandler(handler: () => void) {
  onUnAuthenticated = handler;
}
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    console.log('error status', status);
    if (status === 403 && !window.location.href.includes('/login')
      && !window.location.href.includes('/register')) {
      window.location.href = '/unauthorized';
    }
    if ((status === 401) && !window.location.href.includes('/login')
       && !window.location.href.includes('/register')) {
      if (typeof onUnAuthenticated === 'function') {
        try { onUnAuthenticated(); } catch (e) { console.error('onUnAuthenticated handler error', e); }
      } else {
        // Fallback: navigate to login if no handler registered
        window.location.href = '/login';
      }

    }
    return Promise.reject(error);
  }
);

export default axiosInstance;