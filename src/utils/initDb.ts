/**
 * Initialize the application and return the status
 * This is a simplified version that uses API services
 */
export async function initializeDatabase() {
  console.log('Using API services for data operations');

  // Check if API base URL is configured
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    console.warn('API base URL is not configured. Set VITE_API_BASE_URL in .env file.');
    return {
      success: false,
      message: 'API base URL is not configured',
      usingApi: false
    };
  }

  return {
    success: true,
    message: 'Using API services for data operations',
    usingApi: true,
    apiBaseUrl
  };
}

// Run the initialization if this file is executed directly
if (typeof window !== 'undefined' && window.location.pathname.includes('init-db')) {
  initializeDatabase()
    .then(result => {
      console.log('Application initialization status:', result.message);
      console.log('Using API:', result.usingApi);
      if (result.apiBaseUrl) {
        console.log('API base URL:', result.apiBaseUrl);
      }
    })
    .catch(error => {
      console.error('Application initialization error:', error);
    });
}
