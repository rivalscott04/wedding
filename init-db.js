import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

async function initializeDatabase() {
  console.log('Initializing database...');
  
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
    
    if (!databaseExists) {
      console.log('Database "wedding_invitation" does not exist!');
      console.log('Creating database...');
      
      await pool.execute('CREATE DATABASE IF NOT EXISTS wedding_invitation');
      console.log('Database created successfully!');
    } else {
      console.log('Database "wedding_invitation" exists!');
    }
    
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
    
    // Read the schema file
    try {
      const schemaPath = path.resolve('./database/schema.sql');
      console.log(`Reading schema file from: ${schemaPath}`);
      
      const schemaContent = await fs.readFile(schemaPath, 'utf8');
      console.log('Schema file read successfully!');
      
      // Split the schema into individual statements
      const statements = schemaContent
        .replace(/CREATE DATABASE.*?;/gis, '') // Remove CREATE DATABASE statement
        .replace(/USE.*?;/gis, '') // Remove USE statement
        .split(';')
        .filter(statement => statement.trim() !== '');
      
      console.log(`Found ${statements.length} SQL statements to execute.`);
      
      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (statement) {
          try {
            console.log(`Executing statement ${i + 1}/${statements.length}...`);
            await dbPool.execute(statement);
            console.log(`Statement ${i + 1} executed successfully!`);
          } catch (error) {
            console.error(`Error executing statement ${i + 1}:`, error);
          }
        }
      }
      
      console.log('Schema initialization completed!');
    } catch (error) {
      console.error('Error reading or executing schema file:', error);
    }
    
    // Release the pools
    await dbPool.end();
    await pool.end();
    
    console.log('Database initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Run the initialization
initializeDatabase()
  .then(success => console.log(`Done! Success: ${success}`))
  .catch(error => console.error('Unexpected error:', error));
