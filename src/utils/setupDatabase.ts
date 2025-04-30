import { query, isUsingLocalStorage } from '@/lib/db';

/**
 * Setup database tables and initial data
 */
export async function setupDatabase() {
  // If we're using localStorage, don't try to setup database tables
  if (isUsingLocalStorage()) {
    console.log('Using localStorage, skipping database setup');
    return false;
  }

  try {
    console.log('Setting up database tables...');

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_status (status)
      )
    `);
    console.log('Guests table created or already exists');

    // Create messages table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guest_id INT,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_attending BOOLEAN DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL
      )
    `);
    console.log('Messages table created or already exists');

    // Create settings table for wedding details
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bride_name VARCHAR(255) NOT NULL,
        groom_name VARCHAR(255) NOT NULL,
        wedding_date DATETIME NOT NULL,
        akad_time VARCHAR(100),
        reception_time VARCHAR(100),
        venue_name VARCHAR(255),
        venue_address TEXT,
        venue_map_link TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Settings table created or already exists');

    // Check if settings table has any records
    const settingsCount = await query('SELECT COUNT(*) as count FROM settings');
    if (settingsCount[0].count === 0) {
      // Insert default settings if table is empty
      await query(`
        INSERT INTO settings (bride_name, groom_name, wedding_date, akad_time, reception_time, venue_name, venue_address)
        VALUES ('Syahrina', 'Rival', '2023-12-31 08:00:00', '08:00 - 10:00 WIB', '11:00 - 14:00 WIB', 'Hotel Grand Ballroom', 'Jl. Contoh No. 123, Jakarta Selatan')
      `);
      console.log('Default settings inserted');
    }

    // Check if app_settings table exists
    try {
      const tables = await query('SHOW TABLES');
      const appSettingsTableExists = Array.isArray(tables) && tables.some(row =>
        Object.values(row)[0] === 'app_settings');

      if (!appSettingsTableExists) {
        console.log('app_settings table does not exist, creating it...');

        // Create the table
        await query(`
          CREATE TABLE IF NOT EXISTS app_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(255) NOT NULL UNIQUE,
            setting_value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        // Insert default settings
        await query(`
          INSERT INTO app_settings (setting_key, setting_value)
          VALUES
            ('domain', ''),
            ('theme', 'light'),
            ('music_enabled', 'true'),
            ('show_gallery', 'true'),
            ('show_countdown', 'true'),
            ('show_wishes', 'true'),
            ('rsvp_enabled', 'true')
        `);

        console.log('app_settings table created and populated with default values');
      } else {
        console.log('app_settings table already exists');
      }
    } catch (error) {
      console.error('Error handling app_settings table:', error);
    }

    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}
