// Database configuration
let useLocalStorage = false;
let pool: any = null;
let mysqlInitialized = false;

// Initialize MySQL connection
const initMySQLConnection = async () => {
  try {
    // Use dynamic import to avoid issues with SSR/SSG
    const mysql = await import('mysql2/promise');

    // Create a connection pool
    pool = mysql.createPool({
      host: import.meta.env.VITE_DB_HOST || 'localhost',
      user: import.meta.env.VITE_DB_USER || 'root',
      password: import.meta.env.VITE_DB_PASSWORD || '',
      database: import.meta.env.VITE_DB_NAME || 'wedding_invitation',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    try {
      await pool.execute('SELECT 1');
      mysqlInitialized = true;
      return true;
    } catch (connectionError) {
      useLocalStorage = true;
      return false;
    }
  } catch (importError) {
    useLocalStorage = true;
    return false;
  }
};

// Initialize MySQL connection
initMySQLConnection().catch(() => {
  useLocalStorage = true;
});

export async function query(sql: string, params: any[] = []) {
  if (useLocalStorage) {
    // This is a fallback for when MySQL is not available
    // It will be handled by the service layer
    throw new Error('MySQL not available, using localStorage instead');
  }

  // If pool is not initialized yet, wait a bit
  if (!pool) {
    // Wait for pool to be initialized (max 1 second)
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (pool) break;
    }

    // If pool is still not initialized, use localStorage
    if (!pool) {
      useLocalStorage = true;
      throw new Error('MySQL not available, using localStorage instead');
    }
  }

  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    // If there's an error with the query, fallback to localStorage
    useLocalStorage = true;
    throw error;
  }
}

export async function getConnection() {
  if (useLocalStorage) {
    throw new Error('MySQL not available, using localStorage instead');
  }

  // If pool is not initialized yet, wait a bit
  if (!pool) {
    // Wait for pool to be initialized (max 1 second)
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (pool) break;
    }

    // If pool is still not initialized, use localStorage
    if (!pool) {
      useLocalStorage = true;
      throw new Error('MySQL not available, using localStorage instead');
    }
  }

  try {
    return await pool.getConnection();
  } catch (error) {
    // If there's an error getting a connection, fallback to localStorage
    useLocalStorage = true;
    throw error;
  }
}

// Check if MySQL is available
export async function isMySQLAvailable() {
  if (useLocalStorage) {
    return false;
  }

  // If pool is not initialized yet, wait a bit
  if (!pool) {
    // Wait for pool to be initialized (max 1 second)
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (pool) break;
    }

    // If pool is still not initialized, use localStorage
    if (!pool) {
      useLocalStorage = true;
      return false;
    }
  }

  try {
    await pool.execute('SELECT 1');
    return true;
  } catch (error) {
    useLocalStorage = true;
    return false;
  }
}

// Flag to check if we're using localStorage
export const isUsingLocalStorage = () => useLocalStorage || !mysqlInitialized;

// Initialize database tables if they don't exist
export async function initDatabase() {
  // If we're already using localStorage, don't try to initialize MySQL
  if (useLocalStorage) {
    return false;
  }

  // Wait for MySQL to initialize (max 2 seconds)
  for (let i = 0; i < 20; i++) {
    if (mysqlInitialized) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // If MySQL is still not initialized, use localStorage
  if (!mysqlInitialized) {
    useLocalStorage = true;
    return false;
  }

  try {
    // Check if MySQL is available
    const available = await isMySQLAvailable();
    if (!available) {
      useLocalStorage = true;
      return false;
    }

    // Create guests table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS guests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(20) DEFAULT '',
        status ENUM('active', 'inactive') DEFAULT 'active',
        attendance ENUM('pending', 'confirmed', 'declined') DEFAULT 'pending',
        attendance_date DATETIME,
        attendance_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guest_id INT,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL
      )
    `);

    // Create settings table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) NOT NULL UNIQUE,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default settings if they don't exist
    await query(`
      INSERT IGNORE INTO settings (setting_key, setting_value)
      VALUES ('domain', '')
    `);

    return true;
  } catch (error) {
    useLocalStorage = true;
    return false;
  }
}
