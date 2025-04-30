import { WeddingSettings, AppSettings } from '@/types/settings';
import {
  getLocalWeddingSettings,
  saveLocalWeddingSettings,
  getLocalAppSettings,
  saveLocalAppSettings
} from '@/data/mockData';
import { query, isUsingLocalStorage } from '@/lib/db';

export const settingsService = {
  // Get wedding settings
  getWeddingSettings: async (): Promise<WeddingSettings> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        return getLocalWeddingSettings();
      }

      // Get settings from MySQL
      const settings = await query('SELECT * FROM settings LIMIT 1') as WeddingSettings[];

      if (settings && settings.length > 0) {
        return settings[0];
      }

      // If no settings found in database, return local settings
      return getLocalWeddingSettings();
    } catch (error) {
      console.error('Error fetching wedding settings:', error);
      // Fallback to localStorage
      return getLocalWeddingSettings();
    }
  },

  // Update wedding settings
  updateWeddingSettings: async (settings: WeddingSettings): Promise<WeddingSettings> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const updatedSettings = {
          ...settings,
          updated_at: new Date().toISOString()
        };

        saveLocalWeddingSettings(updatedSettings);
        return updatedSettings;
      }

      // Update settings in MySQL
      if (settings.id) {
        // Update existing settings
        await query(`
          UPDATE settings
          SET bride_name = ?,
              groom_name = ?,
              wedding_date = ?,
              akad_time = ?,
              reception_time = ?,
              venue_name = ?,
              venue_address = ?,
              venue_map_link = ?
          WHERE id = ?
        `, [
          settings.bride_name,
          settings.groom_name,
          settings.wedding_date,
          settings.akad_time,
          settings.reception_time,
          settings.venue_name,
          settings.venue_address,
          settings.venue_map_link || '',
          settings.id
        ]);
      } else {
        // Insert new settings
        const result = await query(`
          INSERT INTO settings (
            bride_name,
            groom_name,
            wedding_date,
            akad_time,
            reception_time,
            venue_name,
            venue_address,
            venue_map_link
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          settings.bride_name,
          settings.groom_name,
          settings.wedding_date,
          settings.akad_time,
          settings.reception_time,
          settings.venue_name,
          settings.venue_address,
          settings.venue_map_link || ''
        ]) as { insertId: number };

        settings.id = result.insertId;
      }

      // Get updated settings
      const updatedSettings = await query(
        'SELECT * FROM settings WHERE id = ?',
        [settings.id]
      ) as WeddingSettings[];

      return updatedSettings[0];
    } catch (error) {
      console.error('Error updating wedding settings:', error);
      // Fallback to localStorage
      const updatedSettings = {
        ...settings,
        updated_at: new Date().toISOString()
      };

      saveLocalWeddingSettings(updatedSettings);
      return updatedSettings;
    }
  },

  // Get app settings
  getAppSettings: async (): Promise<AppSettings> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        return getLocalAppSettings();
      }

      // Get settings from MySQL
      const settingsRows = await query(`
        SELECT setting_key, setting_value
        FROM app_settings
        WHERE setting_key IN ('theme', 'music_enabled', 'show_gallery', 'show_countdown', 'show_wishes', 'rsvp_enabled')
      `) as { setting_key: string, setting_value: string }[];

      if (settingsRows && settingsRows.length > 0) {
        // Convert to AppSettings object
        const settings: Partial<AppSettings> = {};

        for (const row of settingsRows) {
          if (row.setting_key === 'theme') {
            settings.theme = row.setting_value as 'light' | 'dark' | 'auto';
          } else {
            // Convert string 'true'/'false' to boolean
            (settings as any)[row.setting_key] = row.setting_value === 'true';
          }
        }

        // If any settings are missing, use defaults
        const defaultSettings = getLocalAppSettings();
        return { ...defaultSettings, ...settings };
      }

      // If no settings found in database, return local settings
      return getLocalAppSettings();
    } catch (error) {
      console.error('Error fetching app settings:', error);
      // Fallback to localStorage
      return getLocalAppSettings();
    }
  },

  // Update app settings
  updateAppSettings: async (settings: AppSettings): Promise<AppSettings> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        saveLocalAppSettings(settings);
        return settings;
      }

      // Start a transaction
      await query('START TRANSACTION');

      try {
        // Update each setting
        for (const [key, value] of Object.entries(settings)) {
          const stringValue = typeof value === 'boolean' ? String(value) : value;

          await query(`
            INSERT INTO app_settings (setting_key, setting_value)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = ?
          `, [key, stringValue, stringValue]);
        }

        // Commit the transaction
        await query('COMMIT');
      } catch (error) {
        // Rollback on error
        await query('ROLLBACK');
        throw error;
      }

      return settings;
    } catch (error) {
      console.error('Error updating app settings:', error);
      // Fallback to localStorage
      saveLocalAppSettings(settings);
      return settings;
    }
  }
};
