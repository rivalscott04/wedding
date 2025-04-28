import { query } from '@/lib/db';
import { isUsingLocalStorage } from '@/lib/db';

export interface Setting {
  id?: number;
  setting_key: string;
  setting_value: string;
  created_at?: string;
  updated_at?: string;
}

// Local storage key
const SETTINGS_STORAGE_KEY = 'wedding_invitation_settings';

// Get all settings
export async function getAllSettings(): Promise<Setting[]> {
  try {
    if (isUsingLocalStorage()) {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : [];
    }

    const settings = await query('SELECT * FROM settings');
    return settings as Setting[];
  } catch (error) {
    // Fallback to localStorage if MySQL query fails
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : [];
  }
}

// Get a setting by key
export async function getSettingByKey(key: string): Promise<string> {
  try {
    if (isUsingLocalStorage()) {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const settings = storedSettings ? JSON.parse(storedSettings) : [];
      const setting = settings.find((s: Setting) => s.setting_key === key);
      return setting ? setting.setting_value : '';
    }

    const settings = await query('SELECT setting_value FROM settings WHERE setting_key = ?', [key]);
    if (settings && settings.length > 0) {
      return settings[0].setting_value;
    }
    return '';
  } catch (error) {
    // Fallback to localStorage if MySQL query fails
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const settings = storedSettings ? JSON.parse(storedSettings) : [];
    const setting = settings.find((s: Setting) => s.setting_key === key);
    return setting ? setting.setting_value : '';
  }
}

// Update a setting
export async function updateSetting(key: string, value: string): Promise<boolean> {
  try {
    if (isUsingLocalStorage()) {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const settings = storedSettings ? JSON.parse(storedSettings) : [];
      
      const existingIndex = settings.findIndex((s: Setting) => s.setting_key === key);
      if (existingIndex >= 0) {
        settings[existingIndex].setting_value = value;
        settings[existingIndex].updated_at = new Date().toISOString();
      } else {
        settings.push({
          id: Date.now(),
          setting_key: key,
          setting_value: value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      return true;
    }

    // Check if setting exists
    const existingSettings = await query('SELECT id FROM settings WHERE setting_key = ?', [key]);
    
    if (existingSettings && existingSettings.length > 0) {
      // Update existing setting
      await query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
    } else {
      // Insert new setting
      await query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
    }
    
    return true;
  } catch (error) {
    // Fallback to localStorage if MySQL query fails
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const settings = storedSettings ? JSON.parse(storedSettings) : [];
    
    const existingIndex = settings.findIndex((s: Setting) => s.setting_key === key);
    if (existingIndex >= 0) {
      settings[existingIndex].setting_value = value;
      settings[existingIndex].updated_at = new Date().toISOString();
    } else {
      settings.push({
        id: Date.now(),
        setting_key: key,
        setting_value: value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return true;
  }
}

// Get domain setting
export async function getDomain(): Promise<string> {
  const domain = await getSettingByKey('domain');
  return domain || window.location.origin;
}
