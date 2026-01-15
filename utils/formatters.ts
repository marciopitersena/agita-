export const formatCPF = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

export const formatPhone = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 10) {
        return numericValue
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    } else {
        return numericValue
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    }
};
