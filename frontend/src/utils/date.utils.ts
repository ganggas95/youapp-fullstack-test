import { DateStrType, DateType } from '@/interfaces/date.itace';

import dayjs from 'dayjs';

const defaultFormat = "DD / MM / YYYY";

export const formatDate = (
    date: DateType,
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
    return dayjs(date, format).toDate();
}

export const calculateAge = (date: DateType): number | string => {
    if (!date) return "";
    return dayjs().diff(dayjs(date), 'year');
}