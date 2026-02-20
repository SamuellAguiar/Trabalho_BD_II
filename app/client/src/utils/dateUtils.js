const DEFAULT_DATE_OPTIONS = {
     day: '2-digit',
     month: '2-digit',
     year: 'numeric'
};

const DEFAULT_DATETIME_OPTIONS = {
     ...DEFAULT_DATE_OPTIONS,
     hour: '2-digit',
     minute: '2-digit'
};

export const getPrimaryDateValue = (item) =>
     item?.data_ocorrencia ?? item?.data_criacao ?? item?.data_hora ?? null;

export const toValidDate = (value) => {
     if (!value) return null;

     const date = value instanceof Date ? value : new Date(value);
     return Number.isNaN(date.getTime()) ? null : date;
};

export const getValidDateFromItem = (item) => toValidDate(getPrimaryDateValue(item));

export const getDateTimestampFromItem = (item, fallback = 0) => {
     const date = getValidDateFromItem(item);
     return date ? date.getTime() : fallback;
};

export const getDateKeyFromItem = (item) => {
     const date = getValidDateFromItem(item);
     return date ? date.toISOString().slice(0, 10) : null;
};

export const formatDateFromItem = (item, options = DEFAULT_DATE_OPTIONS, fallback = 'N/D') => {
     const date = getValidDateFromItem(item);
     return date ? date.toLocaleDateString('pt-BR', options) : fallback;
};

export const formatDateTimeFromItem = (item, options = DEFAULT_DATETIME_OPTIONS, fallback = 'N/D') => {
     const date = getValidDateFromItem(item);
     return date ? date.toLocaleString('pt-BR', options) : fallback;
};
