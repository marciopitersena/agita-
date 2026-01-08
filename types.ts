
export type ModuleType = 'ouvintes' | 'ganhadores' | 'premios' | 'amigos' | 'colaboradores' | 'patrocinadores';

export interface BaseEntity {
  id: string;
}

export interface Person extends BaseEntity {
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  telefone: string;
  idade: string;
  instagram: string;
}

export interface Ouvinte extends Person {}
export interface Ganhador extends Person {}
export interface Amigo extends Person {}

export interface Premio extends BaseEntity {
  nome: string;
  descricao: string;
  valor: string;
  patrocinador: string;
}

export interface Colaborador extends BaseEntity {
  nome: string;
  funcao: string;
  telefone: string;
  instagram: string;
}

export interface Patrocinador extends BaseEntity {
  razaoSocial: string;
  cnpj: string;
  instagram: string;
  endereco: string;
  telefone: string;
  valorPatrocinado: string;
  premioPatrocinado: string;
}

export type EntityData = Ouvinte | Ganhador | Amigo | Premio | Colaborador | Patrocinador;
