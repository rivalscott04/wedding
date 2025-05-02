// Import React explicitly to ensure it's loaded before any context is created
import React from 'react'
// Make React available globally
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.React = React;
}

import { createRoot } from 'react-dom/client'
// Import our ensure-react utility
import './lib/ensure-react'
import App from './App.tsx'
import './index.css'
import { fixSlugs } from './utils/fixSlugs'
import { initializeDatabase } from './utils/initDb'

// Perbaiki slug yang menggunakan tanda strip menjadi spasi
fixSlugs();

// Function to render the app
const renderApp = () => {
  if (!document.getElementById("root")?.hasChildNodes()) {
    createRoot(document.getElementById("root")!).render(<App />);
  }
};

// Initialize application
console.log('Starting application and initializing API services...');
initializeDatabase()
  .then((result) => {
    // Log initialization result
    console.log(`Application initialization ${result.success ? 'successful' : 'failed'}: ${result.message}`);
    if (result.apiBaseUrl) {
      console.log(`API base URL: ${result.apiBaseUrl}`);
    }

    // Render the app regardless of initialization result
    renderApp();
  })
  .catch((error) => {
    // Log any unexpected errors
    console.error('Unexpected error during application initialization:', error);

    // Render the app anyway
    renderApp();
  });

// If initialization takes too long, render the app anyway
// This ensures the app doesn't hang if there are API issues
setTimeout(renderApp, 2000);
