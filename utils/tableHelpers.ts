import { ModuleType } from '../types';

export const getHeaders = (module: ModuleType) => {
    switch (module) {
        case 'ouvintes':
        case 'ganhadores':
        case 'amigos':
            return ['Nome', 'Telefone', 'Instagram', 'Idade'];
        case 'premios':
            return ['Prêmio', 'Valor', 'Patrocinador'];
        case 'colaboradores':
            return ['Nome', 'Função', 'Telefone'];
        case 'patrocinadores':
            return ['Razão Social', 'CNPJ', 'Valor'];
        default:
            return [];
    }
};

export const getRows = (module: ModuleType, item: any) => {
    switch (module) {
        case 'ouvintes':
        case 'ganhadores':
        case 'amigos':
            return [item.nome, item.telefone, item.instagram, item.idade];
        case 'premios':
            return [item.nome, item.valor, item.patrocinador];
        case 'colaboradores':
            return [item.nome, item.funcao, item.telefone];
        case 'patrocinadores':
            return [item.razaoSocial, item.cnpj, item.valorPatrocinado];
        default:
            return [];
    }
};
