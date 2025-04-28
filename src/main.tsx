import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { fixSlugs } from './utils/fixSlugs'
import { initDatabase, isUsingLocalStorage } from './lib/db'

// Perbaiki slug yang menggunakan tanda strip menjadi spasi
fixSlugs();

// Function to render the app
const renderApp = () => {
  if (!document.getElementById("root")?.hasChildNodes()) {
    createRoot(document.getElementById("root")!).render(<App />);
  }
};

// Initialize database
initDatabase()
  .then((success) => {
    // Database initialized successfully
    if (success) {
      // MySQL is available and initialized
    } else {
      // Using localStorage fallback
    }
  })
  .catch(() => {
    // Using localStorage fallback
  })
  .finally(() => {
    // Render the app regardless of database initialization
    renderApp();
  });

// If database initialization takes too long, render the app anyway
// This ensures the app doesn't hang if there are database issues
setTimeout(renderApp, 1000);
