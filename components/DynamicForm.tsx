
import React, { useState, useEffect } from 'react';
import { ModuleType, EntityData } from '../types';
import { ICONS, MODULES } from '../constants';
import { storageService } from '../services/storageService';

interface DynamicFormProps {
  module: ModuleType;
  initialData?: EntityData;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ module, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<any>({ id: crypto.randomUUID() });
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: crypto.randomUUID() });
    }
    
    const settings = storageService.getSettings();
    if (settings.logo) {
      setLogo(settings.logo);
    }
  }, [initialData, module]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePrintRecord = () => {
    window.print();
  };

  const renderField = (name: string, label: string, type: string = "text", placeholder: string = "", isRequired: boolean = true) => (
    <div className="mb-4 print:hidden">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {!isRequired && <span className="text-slate-400 font-normal text-xs">(Opcional)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        placeholder={placeholder}
        required={isRequired}
        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
    </div>
  );

  const moduleLabel = MODULES.find(m => m.id === module)?.label || module;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* Header do Formulário */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center print:hidden">
        <h3 className="font-bold text-slate-800">{initialData ? 'Editar Registro' : 'Novo Cadastro'}</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          {ICONS.Cancel}
        </button>
      </div>

      {/* Formulário Principal (Oculto na Impressão) */}
      <form onSubmit={handleSubmit} className="p-6 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {(module === 'ouvintes' || module === 'ganhadores' || module === 'amigos') && (
            <>
              {renderField('nome', 'Nome Completo')}
              {renderField('cpf', 'CPF', 'text', '000.000.000-00', false)}
              {renderField('rg', 'RG', 'text', '', false)}
              {renderField('endereco', 'Endereço', 'text', '', false)}
              {renderField('telefone', 'Telefone', 'tel', '(00) 00000-0000')}
              {renderField('idade', 'Idade', 'number', '', false)}
              {renderField('instagram', 'Instagram', 'text', '@usuario', false)}
            </>
          )}

          {module === 'premios' && (
            <>
              {renderField('nome', 'Nome do Prêmio')}
              {renderField('descricao', 'Descrição do Prêmio')}
              {renderField('valor', 'Valor Estimado', 'text', 'R$ 0,00')}
              {renderField('patrocinador', 'Patrocinador Relacionado')}
            </>
          )}

          {module === 'colaboradores' && (
            <>
              {renderField('nome', 'Nome Completo')}
              {renderField('funcao', 'Função / Cargo')}
              {renderField('telefone', 'Telefone')}
              {renderField('instagram', 'Instagram', 'text', '@usuario', false)}
            </>
          )}

          {module === 'patrocinadores' && (
            <>
              {renderField('razaoSocial', 'Razão Social')}
              {renderField('cnpj', 'CNPJ', 'text', '00.000.000/0000-00')}
              {renderField('instagram', 'Instagram', 'text', '@usuario', false)}
              {renderField('endereco', 'Endereço Comercial', 'text', '', false)}
              {renderField('telefone', 'Telefone de Contato')}
              {renderField('valorPatrocinado', 'Valor Patrocinado')}
              {renderField('premioPatrocinado', 'Prêmio Patrocinado')}
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrintRecord}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              {ICONS.Print}
              Imprimir Ficha Detalhada
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
            >
              {ICONS.Save}
              Salvar Dados
            </button>
          </div>
        </div>
      </form>

      {/* --- FICHA CADASTRAL INDIVIDUAL (Apenas para Impressão) --- */}
      <div className="hidden print:block p-12 bg-white text-black font-sans">
        <div className="flex flex-col items-center text-center border-b-4 border-slate-900 pb-8 mb-10">
          {logo ? (
            <img src={logo} alt="Logo Agita Capital" className="h-40 w-auto object-contain mb-4" />
          ) : (
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">Agita Capital</h1>
          )}
          <div className="mt-2 space-y-1">
            <p className="text-xl font-bold text-slate-800 uppercase tracking-[0.3em]">Ficha Cadastral Individual</p>
            <div className="inline-block px-4 py-1.5 bg-slate-900 text-white rounded text-sm font-bold uppercase tracking-widest mt-2">
              Módulo: {moduleLabel}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-2 border-slate-200 p-10 rounded-2xl">
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'id') return null;
              
              // Formatação do label
              const labels: Record<string, string> = {
                nome: 'Nome Completo',
                cpf: 'CPF',
                rg: 'RG',
                endereco: 'Endereço',
                telefone: 'Telefone',
                idade: 'Idade',
                instagram: 'Instagram',
                descricao: 'Descrição',
                valor: 'Valor',
                patrocinador: 'Patrocinador',
                funcao: 'Função',
                razaoSocial: 'Razão Social',
                cnpj: 'CNPJ',
                valorPatrocinado: 'Valor Patrocinado',
                premioPatrocinado: 'Prêmio Patrocinado'
              };

              return (
                <div key={key} className="border-b-2 border-slate-50 pb-3">
                  <span className="block text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{labels[key] || key}:</span>
                  <span className="text-2xl font-semibold text-black break-words leading-tight">
                    {value?.toString() || '_______________________'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-20 space-y-20">
            <div className="flex justify-center">
              <div className="w-2/3 border-t-2 border-slate-300 pt-4 text-center">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Assinatura do Responsável</span>
              </div>
            </div>
            
            {(module === 'ganhadores') && (
              <div className="flex justify-center">
                <div className="w-2/3 border-t-2 border-slate-300 pt-4 text-center">
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Assinatura do Ganhador</span>
                  <p className="text-[10px] text-slate-400 mt-1 italic">(Confirmação de recebimento de prêmio)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-10 left-0 right-0 text-center text-[9pt] text-slate-300 font-bold uppercase tracking-[0.2em]">
          Gerado em {new Date().toLocaleString('pt-BR')} • Sistema de Gestão Agita Capital Admin
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
