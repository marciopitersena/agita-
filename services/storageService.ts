import { ModuleType, EntityData } from '../types';
import { db } from './firebase';
import { ref, get, set, remove, update, child } from 'firebase/database';

/**
 * Service to interact with Firebase Realtime Database
 */

export const storageService = {
  getAll: async <T extends EntityData>(module: ModuleType): Promise<T[]> => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, module));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert object to array
        return Object.values(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },

  save: async (module: ModuleType, item: EntityData): Promise<void> => {
    try {
      const itemRef = ref(db, `${module}/${item.id}`);
      await set(itemRef, item);
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  },

  delete: async (module: ModuleType, id: string): Promise<void> => {
    try {
      const itemRef = ref(db, `${module}/${id}`);
      await remove(itemRef);
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  },

  // Configurações Globais (Logo, etc)
  getSettings: async () => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'settings'));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return { logo: null };
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      return { logo: null };
    }
  },

  saveSettings: async (settings: { logo: string | null }) => {
    try {
      const settingsRef = ref(db, 'settings');
      await set(settingsRef, settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  },

  getAppsScriptSnippet: () => {
    return `// Firebase backend implementation in progress`;
  }
};
