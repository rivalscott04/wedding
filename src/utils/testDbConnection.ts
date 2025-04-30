import { initDatabase, query, isUsingLocalStorage } from '@/lib/db';

/**
 * Test database connection and operations
 */
export async function testDatabaseConnection() {
  console.log('Testing database connection...');

  try {
    // Initialize database
    const initialized = await initDatabase();

    if (isUsingLocalStorage()) {
      console.log('Using localStorage instead of MySQL. Check your database connection settings.');
      return {
        success: false,
        message: 'Using localStorage instead of MySQL',
        details: {
          usingLocalStorage: true,
          initialized: initialized
        }
      };
    }

    if (!initialized) {
      console.log('Failed to initialize database.');
      return {
        success: false,
        message: 'Failed to initialize database',
        details: {
          usingLocalStorage: isUsingLocalStorage(),
          initialized: initialized
        }
      };
    }

    console.log('Database initialized successfully.');

    // Test a simple query
    const result = await query('SELECT 1 as test');
    console.log('Test query result:', result);

    // Get database tables
    const tables = await query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);
    console.log('Database tables:', tableNames);

    // Test guests table
    const guestsCount = await query('SELECT COUNT(*) as count FROM guests');
    console.log(`Number of guests in database: ${guestsCount[0].count}`);

    // Test messages table
    const messagesCount = await query('SELECT COUNT(*) as count FROM messages');
    console.log(`Number of messages in database: ${messagesCount[0].count}`);

    // Test settings table
    const settings = await query('SELECT * FROM settings LIMIT 1');
    console.log('Wedding settings:', settings.length > 0 ? 'Found' : 'Not found');

    // Get app_settings table if it exists
    let appSettingsCount = 0;
    try {
      // Check if app_settings table exists
      const tables = await query('SHOW TABLES');
      const appSettingsTableExists = Array.isArray(tables) && tables.some(row =>
        Object.values(row)[0] === 'app_settings');

      if (appSettingsTableExists) {
        const appSettings = await query('SELECT COUNT(*) as count FROM app_settings');
        appSettingsCount = appSettings[0].count;
        console.log(`Number of app settings in database: ${appSettingsCount}`);
      } else {
        console.log('app_settings table does not exist');
      }
    } catch (error) {
      console.error('Error querying app_settings:', error);
    }

    console.log('Database connection test completed successfully.');

    return {
      success: true,
      message: 'Database connection test completed successfully',
      details: {
        usingLocalStorage: false,
        initialized: true,
        tables: tableNames,
        counts: {
          guests: guestsCount[0].count,
          messages: messagesCount[0].count,
          settings: settings.length,
          appSettings: appSettingsCount
        }
      }
    };
  } catch (error) {
    console.error('Error testing database connection:', error);
    return {
      success: false,
      message: `Error testing database connection: ${error instanceof Error ? error.message : String(error)}`,
      details: {
        error: error instanceof Error ? error.message : String(error)
      }
    };
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined' && window.location.pathname.includes('test-db')) {
  testDatabaseConnection()
    .then(success => {
      console.log(success ? 'Database test passed!' : 'Database test failed!');
    })
    .catch(error => {
      console.error('Database test error:', error);
    });
}
