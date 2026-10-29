import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export const storage = {
  get: async (key: string): Promise<string | null> => {
    try {
      if (Capacitor.isPluginAvailable('Preferences')) {
        const { value } = await Preferences.get({ key });
        if (value !== null) return value;
      }
      return localStorage.getItem(key);
    } catch {
      return localStorage.getItem(key);
    }
  },

  set: async (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
      if (Capacitor.isPluginAvailable('Preferences')) {
        await Preferences.set({ key, value });
      }
    } catch {
      // Fallback already saved in localStorage
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
      if (Capacitor.isPluginAvailable('Preferences')) {
        await Preferences.remove({ key });
      }
    } catch {
      // Fallback already removed from localStorage
    }
  },

  isOfflineMode: (): boolean => {
    return (
      localStorage.getItem('mslift_offline_mode') === 'true' ||
      import.meta.env.VITE_OFFLINE_TEST === 'true'
    );
  },

  setOfflineMode: (enabled: boolean): void => {
    localStorage.setItem('mslift_offline_mode', enabled ? 'true' : 'false');
    Preferences.set({ key: 'mslift_offline_mode', value: enabled ? 'true' : 'false' }).catch(() => {});
  }
};
