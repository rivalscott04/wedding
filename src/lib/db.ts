// This file is kept for backward compatibility with components that still use it
// The application now uses API services instead of direct database access

// Always return false to indicate we're using API instead of localStorage
export const isUsingLocalStorage = () => false;

// Dummy function that always returns false for backward compatibility
export async function initDatabase() {
  console.log('Using API services instead of direct database access');
  return false;
}

// Dummy function for backward compatibility
export async function isMySQLAvailable() {
  return false;
}

// Dummy query function for backward compatibility
export async function query(sql: string, params: any[] = []) {
  console.warn('Database queries are no longer supported. Use API services instead.');
  throw new Error('Database queries are no longer supported. Use API services instead.');
}

// Dummy function for backward compatibility
export async function getConnection() {
  console.warn('Database connections are no longer supported. Use API services instead.');
  throw new Error('Database connections are no longer supported. Use API services instead.');
}
