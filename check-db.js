import mysql from 'mysql2/promise';

async function checkDatabaseConnection() {
  console.log('Checking database connection...');

  try {
    // Create a connection pool
    const pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    });

    console.log('Attempting to connect to MySQL server...');

    // Test the connection
    await pool.execute('SELECT 1');
    console.log('MySQL server connection successful!');

    // Check if the database exists
    const [rows] = await pool.execute('SHOW DATABASES');
    const databaseExists = rows.some(row => row.Database === 'wedding_invitation');

    if (databaseExists) {
      console.log('Database "wedding_invitation" exists!');

      // Connect to the database
      const dbPool = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'wedding_invitation',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0
      });

      console.log('Attempting to connect to the database...');
      await dbPool.execute('SELECT 1');
      console.log('Database connection successful!');

      // Release the pool
      await dbPool.end();
    } else {
      console.log('Database "wedding_invitation" does not exist!');
      console.log('Creating database...');

      await pool.execute('CREATE DATABASE IF NOT EXISTS wedding_invitation');
      console.log('Database created successfully!');
    }

    // Release the pool
    await pool.end();

    console.log('Database check completed successfully!');
  } catch (error) {
    console.error('Error checking database connection:', error);
  }
}

// Run the check
checkDatabaseConnection()
  .then(() => console.log('Done!'))
  .catch(error => console.error('Unexpected error:', error));
