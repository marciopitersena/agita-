
import React from 'react';
import {
  Users,
  Trophy,
  Gift,
  UserPlus,
  Briefcase,
  Handshake,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  Printer,
  X,
  Download
} from 'lucide-react';
import { ModuleType } from './types';

export const MODULES: { id: ModuleType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'ouvintes', label: 'Ouvintes', icon: <Users size={20} />, color: 'bg-blue-600' },
  { id: 'ganhadores', label: 'Ganhadores', icon: <Trophy size={20} />, color: 'bg-yellow-500' },
  { id: 'premios', label: 'Prêmios', icon: <Gift size={20} />, color: 'bg-purple-600' },
  { id: 'amigos', label: 'Amigos', icon: <UserPlus size={20} />, color: 'bg-pink-600' },
  { id: 'colaboradores', label: 'Colaboradores', icon: <Briefcase size={20} />, color: 'bg-indigo-600' },
  { id: 'patrocinadores', label: 'Patrocinadores', icon: <Handshake size={20} />, color: 'bg-emerald-600' },
];

export const ICONS = {
  Search: <Search size={20} />,
  Plus: <Plus size={20} />,
  Trash: <Trash2 size={18} />,
  Edit: <Edit size={18} />,
  Save: <Save size={20} />,
  Cancel: <X size={20} />,
  Print: <Printer size={20} />,
  Download: <Download size={20} />,
};
