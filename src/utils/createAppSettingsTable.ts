import { query } from '@/lib/db';

/**
 * Check if app_settings table exists and create it if it doesn't
 */
export async function createAppSettingsTableIfNotExists() {
  try {
    // Check if the table exists
    const [tables] = await query('SHOW TABLES LIKE ?', ['app_settings']);
    const tableExists = Array.isArray(tables) && tables.length > 0;
    
    if (!tableExists) {
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
      return true;
    }
    
    console.log('app_settings table already exists');
    return true;
  } catch (error) {
    console.error('Error creating app_settings table:', error);
    return false;
  }
}
