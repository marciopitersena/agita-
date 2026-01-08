
import React, { useState, useEffect, useRef } from 'react';
import { MODULES } from '../constants';
import { ModuleType } from '../types';
import { storageService } from '../services/storageService';
import { Camera } from 'lucide-react';

interface LayoutProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeModule, setActiveModule, children }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const settings = storageService.getSettings();
    if (settings.logo) {
      setLogo(settings.logo);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        storageService.saveSettings({ logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja remover o logotipo atual?")) {
      setLogo(null);
      storageService.saveSettings({ logo: null });
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 relative group cursor-pointer" onClick={triggerUpload}>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleLogoUpload} 
          />
          
          <div className="flex flex-col items-center justify-center min-h-[120px]">
            {logo ? (
              <div className="relative w-full flex justify-center">
                <img src={logo} alt="Logo Agita Capital" className="max-h-32 w-auto object-contain mb-2 rounded shadow-2xl transition-transform group-hover:scale-105" />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-lg" onClick={removeLogo}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            ) : (
              <h1 className="text-3xl font-black tracking-tighter text-white flex flex-col items-center gap-0 leading-none">
                <span className="bg-red-600 px-3 py-1 rounded-md mb-1 shadow-lg shadow-red-900/40 italic">Agita</span>
                <span className="text-slate-400 text-xl tracking-widest uppercase font-light">Capital</span>
              </h1>
            )}
            
            {/* Overlay de Upload no Hover */}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-t-lg z-20">
              <div className="flex flex-col items-center gap-1 bg-slate-800/80 p-3 rounded-full border border-slate-700 shadow-xl">
                <Camera size={24} className="text-indigo-400" />
                <span className="text-[9px] uppercase font-bold tracking-widest text-white">Alterar</span>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em] font-bold text-center opacity-60">Sistema de Gestão</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-4">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Menu Principal</h2>
            {MODULES.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 mb-2 ${
                  activeModule === module.id
                    ? `${module.color} text-white shadow-xl shadow-indigo-900/40 translate-x-1`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {module.icon}
                <span className="font-semibold text-sm">{module.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 text-center bg-slate-950/30">
          <p className="text-[9px] text-slate-600 font-medium">v1.2.0 • AGITA CAPITAL ADMIN</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            {logo && (
              <img src={logo} alt="Mini Logo" className="h-12 w-auto object-contain block md:hidden rounded shadow-sm" />
            )}
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight capitalize">
              {activeModule}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col text-right">
               <span className="text-sm font-bold text-slate-800">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
               </span>
               <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
               </span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
