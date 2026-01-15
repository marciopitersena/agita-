
import React, { useState } from 'react';
// Fix: Added missing import for Search component
import { Search } from 'lucide-react';
import { ModuleType, EntityData } from '../types';
import { ICONS } from '../constants';
import { getHeaders, getRows } from '../utils/tableHelpers';

interface DataTableProps {
  module: ModuleType;
  data: EntityData[];
  onEdit: (item: EntityData) => void;
  onDelete: (id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ module, data, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item: any) => {
    const searchString = JSON.stringify(item).toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Helper functions moved to utils/tableHelpers.ts

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {ICONS.Search}
          </span>
          <input
            type="text"
            placeholder="Pesquisar registros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all text-sm"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total: {filteredData.length} registros
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100/50 border-b border-slate-200">
              {getHeaders(module).map((header) => (
                <th key={header} className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {header}
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  {getRows(module, item).map((val, idx) => (
                    <td key={idx} className="px-6 py-4 text-sm text-slate-700">
                      {val}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        {ICONS.Edit}
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        {ICONS.Trash}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={getHeaders(module).length + 1} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                      <Search size={40} />
                    </div>
                    <p className="text-slate-500 font-medium">Nenhum registro encontrado</p>
                    <p className="text-slate-400 text-sm">Tente mudar sua pesquisa ou adicionar um novo item.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
