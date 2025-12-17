// utils/ApiClient.tsx
"use client";
import axios from 'axios';
import { redirect } from 'next/navigation';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This variable will hold the function that AuthContext gives us
let onUnAuthenticated: (() => void) | undefined;

// AuthContext will call this later
export function registerUnauthenticatedHandler(handler: () => void) {
  onUnAuthenticated = handler;
}

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hr_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    
    console.log('API Error Status:', status);
    
    if (status === 403 && !currentPath.includes('/unauthorized')) {
      redirect('/unauthorized');
    }
    
    if (status === 401 && 
        !currentPath.includes('/login') && 
        !currentPath.includes('/register')) {
      if (onUnAuthenticated) {
        onUnAuthenticated();
      } else {
        // Fallback: redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hr_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;