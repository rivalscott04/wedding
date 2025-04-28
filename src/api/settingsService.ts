import { WeddingSettings, AppSettings } from '@/types/settings';
import { 
  getLocalWeddingSettings, 
  saveLocalWeddingSettings,
  getLocalAppSettings,
  saveLocalAppSettings
} from '@/data/mockData';

export const settingsService = {
  // Get wedding settings
  getWeddingSettings: async (): Promise<WeddingSettings> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getLocalWeddingSettings();
  },

  // Update wedding settings
  updateWeddingSettings: async (settings: WeddingSettings): Promise<WeddingSettings> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedSettings = {
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    saveLocalWeddingSettings(updatedSettings);
    return updatedSettings;
  },

  // Get app settings
  getAppSettings: async (): Promise<AppSettings> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getLocalAppSettings();
  },

  // Update app settings
  updateAppSettings: async (settings: AppSettings): Promise<AppSettings> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    saveLocalAppSettings(settings);
    return settings;
  }
};
