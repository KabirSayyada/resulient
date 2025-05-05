
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from '@/hooks/useAuth';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme/ThemeProvider";

// Initialize Google Analytics page view tracking
const trackPageView = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-ZB5NWGMDTS', {
      page_path: window.location.pathname,
    });
  }
};

// Add gtag to the window object type
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
