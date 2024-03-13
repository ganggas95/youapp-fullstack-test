import dayjs from 'dayjs';

import { DateStrType, DateType } from '@/interfaces/date.itace';

const defaultFormat = "DD/MM/YYYY";

export const formatDate = (
    date?: DateType,
    format: string = defaultFormat
): string => {
    if (!date) return "-";
    return dayjs(date).format(format);
}

export const stringToDate = (
    date: DateStrType,
    format: string = defaultFormat
): Date | null => {
    if (!date) return null;
    if (dayjs(date, format).isValid()) return dayjs(date, format).toDate();
    return null
}

export const calculateAge = (date: DateType): number | string => {
    if (!date) return "";
    return dayjs().diff(dayjs(date), 'year');
}