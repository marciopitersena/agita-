
import { ModuleType, EntityData } from '../types';

/**
 * Este serviço simula o banco de dados. 
 * Em uma implementação real com Google Sheets, estas funções chamariam 
 * a URL do Google Apps Script via fetch().
 */

const STORAGE_KEY_PREFIX = 'agita_capital_';
const SETTINGS_KEY = 'agita_capital_settings';

export const storageService = {
  getAll: async <T extends EntityData>(module: ModuleType): Promise<T[]> => {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + module);
    return data ? JSON.parse(data) : [];
  },

  save: async (module: ModuleType, item: EntityData): Promise<void> => {
    const items = await storageService.getAll(module);
    const index = items.findIndex(i => i.id === item.id);
    
    if (index > -1) {
      items[index] = item;
    } else {
      items.push(item);
    }
    
    localStorage.setItem(STORAGE_KEY_PREFIX + module, JSON.stringify(items));
  },

  delete: async (module: ModuleType, id: string): Promise<void> => {
    const items = await storageService.getAll(module);
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY_PREFIX + module, JSON.stringify(filtered));
  },

  // Configurações Globais (Logo, etc)
  getSettings: () => {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : { logo: null };
  },

  saveSettings: (settings: { logo: string | null }) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  /**
   * Sugestão de código para Google Apps Script (Backend)
   */
  getAppsScriptSnippet: () => {
    return `
      function doPost(e) {
        var action = e.parameter.action;
        var sheetName = e.parameter.sheet;
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
        
        // Lógica de CRUD simplificada aqui...
        return ContentService.createTextOutput("Sucesso").setMimeType(ContentService.MimeType.TEXT);
      }
    `;
  }
};
