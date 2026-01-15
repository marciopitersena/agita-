
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import DataTable from './components/DataTable';
import DynamicForm from './components/DynamicForm';
import { ModuleType, EntityData } from './types';
import { storageService } from './services/storageService';
import { ICONS, MODULES } from './constants';
import { getHeaders, getRows } from './utils/tableHelpers';
import * as XLSX from 'xlsx';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('ouvintes');
  const [data, setData] = useState<EntityData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EntityData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const settings = storageService.getSettings();
    if (settings.logo) {
      setLogo(settings.logo);
    }
  }, [showForm]); // Recarrega logo ao fechar form

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const items = await storageService.getAll(activeModule);
      setData(items);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [activeModule]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (formData: EntityData) => {
    try {
      await storageService.save(activeModule, formData);
      setShowForm(false);
      setEditingItem(undefined);
      loadData();
    } catch (error) {
      alert("Erro ao salvar dados!");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.")) {
      try {
        await storageService.delete(activeModule, id);
        loadData();
      } catch (error) {
        alert("Erro ao excluir!");
      }
    }
  };

  const handleEdit = (item: EntityData) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Get headers for the current module
    const headers = getHeaders(activeModule);

    // Format data rows matching the table structure
    const rows = data.map(item => getRows(activeModule, item));

    // Combine headers and rows
    const wsData = [headers, ...rows];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeModule);

    // Generate filename with timestamp
    const date = new Date().toISOString().split('T')[0];
    const filename = `relatorio_${activeModule}_${date}.xlsx`;

    // Trigger download
    XLSX.writeFile(wb, filename);
  };

  const currentModuleLabel = MODULES.find(m => m.id === activeModule)?.label || activeModule;

  return (
    <Layout activeModule={activeModule} setActiveModule={setActiveModule}>
      <div className="max-w-6xl mx-auto space-y-6 print:hidden">

        {/* Module Header Actions */}
        {!showForm && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-slate-500 text-sm">Gerencie os registros do módulo de {activeModule}.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-all font-medium whitespace-nowrap shadow-sm"
              >
                {ICONS.Print}
                Imprimir Relatório
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all font-medium whitespace-nowrap"
              >
                {ICONS.Download}
                Exportar Excel
              </button>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-all font-medium whitespace-nowrap"
              >
                {ICONS.Plus}
                Novo Cadastro
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Carregando informações...</p>
          </div>
        ) : showForm ? (
          <DynamicForm
            module={activeModule}
            initialData={editingItem}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <DataTable
            module={activeModule}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Info Card for integration */}
        {!showForm && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mt-12 flex gap-4 items-start shadow-sm">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-indigo-900 font-bold text-sm">Integração com Google Sheets</h4>
              <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
                Este sistema está configurado atualmente para armazenamento local (Cache do Navegador).
                Para integrar com o seu Google Drive, basta conectar a URL do Google Apps Script no <code>storageService.ts</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- ESTRUTURA PARA IMPRESSÃO (Oculta na tela) --- */}
      <div className="hidden print:block p-8 bg-white text-black min-h-screen">
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-8">
          <div className="flex items-center gap-4">
            {logo ? (
              <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
            ) : (
              <h1 className="text-3xl font-bold italic">AGITA CAPITAL</h1>
            )}
            {!logo && <p className="text-sm uppercase tracking-widest text-slate-600 ml-2">Relatório Geral</p>}
          </div>
          <div className="text-right text-xs">
            <p className="text-lg font-bold mb-1 uppercase tracking-wider">{currentModuleLabel}</p>
            <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
            <p>Hora: {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-[10pt]">
          <thead>
            <tr className="bg-slate-100">
              {activeModule === 'premios' ? (
                <>
                  <th className="border border-slate-300 p-2 text-left">Nome</th>
                  <th className="border border-slate-300 p-2 text-left">Valor</th>
                  <th className="border border-slate-300 p-2 text-left">Patrocinador</th>
                  <th className="border border-slate-300 p-2 text-left">Descrição</th>
                </>
              ) : activeModule === 'patrocinadores' ? (
                <>
                  <th className="border border-slate-300 p-2 text-left">Razão Social</th>
                  <th className="border border-slate-300 p-2 text-left">CNPJ</th>
                  <th className="border border-slate-300 p-2 text-left">Valor</th>
                  <th className="border border-slate-300 p-2 text-left">Prêmio</th>
                  <th className="border border-slate-300 p-2 text-left">Telefone</th>
                </>
              ) : activeModule === 'colaboradores' ? (
                <>
                  <th className="border border-slate-300 p-2 text-left">Nome</th>
                  <th className="border border-slate-300 p-2 text-left">Função</th>
                  <th className="border border-slate-300 p-2 text-left">Telefone</th>
                  <th className="border border-slate-300 p-2 text-left">Instagram</th>
                </>
              ) : (
                <>
                  <th className="border border-slate-300 p-2 text-left">Nome</th>
                  <th className="border border-slate-300 p-2 text-left">Telefone</th>
                  <th className="border border-slate-300 p-2 text-left">Instagram</th>
                  <th className="border border-slate-300 p-2 text-left">CPF</th>
                  <th className="border border-slate-300 p-2 text-left">Endereço</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item: any, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {activeModule === 'premios' ? (
                    <>
                      <td className="border border-slate-300 p-2">{item.nome}</td>
                      <td className="border border-slate-300 p-2">{item.valor}</td>
                      <td className="border border-slate-300 p-2">{item.patrocinador}</td>
                      <td className="border border-slate-300 p-2">{item.descricao}</td>
                    </>
                  ) : activeModule === 'patrocinadores' ? (
                    <>
                      <td className="border border-slate-300 p-2">{item.razaoSocial}</td>
                      <td className="border border-slate-300 p-2">{item.cnpj}</td>
                      <td className="border border-slate-300 p-2">{item.valorPatrocinado}</td>
                      <td className="border border-slate-300 p-2">{item.premioPatrocinado}</td>
                      <td className="border border-slate-300 p-2">{item.telefone}</td>
                    </>
                  ) : activeModule === 'colaboradores' ? (
                    <>
                      <td className="border border-slate-300 p-2">{item.nome}</td>
                      <td className="border border-slate-300 p-2">{item.funcao}</td>
                      <td className="border border-slate-300 p-2">{item.telefone}</td>
                      <td className="border border-slate-300 p-2">{item.instagram}</td>
                    </>
                  ) : (
                    <>
                      <td className="border border-slate-300 p-2 font-medium">{item.nome}</td>
                      <td className="border border-slate-300 p-2">{item.telefone}</td>
                      <td className="border border-slate-300 p-2">{item.instagram || '-'}</td>
                      <td className="border border-slate-300 p-2">{item.cpf || '-'}</td>
                      <td className="border border-slate-300 p-2">{item.endereco || '-'}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-slate-300 p-4 text-center text-slate-400">Nenhum dado cadastrado neste módulo.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-12 pt-4 border-t border-slate-200 text-center text-[8pt] text-slate-400 uppercase tracking-widest font-bold">
          Documento gerado em {new Date().toLocaleString()} • Agita Capital Admin
        </div>
      </div>
    </Layout>
  );
};

export default App;
