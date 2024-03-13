import dayjs from 'dayjs';

import { CHINESE_ZODIAC_SIGNS } from '@/constants/chinese-zodiac';
import { DateType } from '@/interfaces/date.itace';

/**
 * This function takes a date of birth and returns the zodiac sign based on the date.
 *
 * @param {Date} dateOfBirth - The date of birth of the person
 * @return {Object} An object containing the zodiac sign
 */
export function detectZodiac(dateOfBirth: DateType): string | null {
    if (!dateOfBirth) return null;

    const date = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
    const monthIndex = date.getMonth();
    const day = date.getDate();

    const zodiacSigns = [
        { monthStart: [2, 21], monthEnd: [3, 19], name: "Aries" },
        { monthStart: [3, 20], monthEnd: [4, 20], name: "Taurus" },
        { monthStart: [4, 21], monthEnd: [5, 20], name: "Gemini" },
        { monthStart: [5, 21], monthEnd: [6, 22], name: "Cancer" },
        { monthStart: [6, 23], monthEnd: [7, 22], name: "Leo" },
        { monthStart: [7, 23], monthEnd: [8, 22], name: "Virgo" },
        { monthStart: [8, 23], monthEnd: [9, 22], name: "Libra" },
        { monthStart: [9, 23], monthEnd: [10, 21], name: "Scorpio" },
        { monthStart: [10, 22], monthEnd: [11, 21], name: "Sagittarius" },
        { monthStart: [11, 22], monthEnd: [0, 19], name: "Capricorn" },
        { monthStart: [0, 20], monthEnd: [1, 18], name: "Aquarius" },
        { monthStart: [1, 19], monthEnd: [2, 20], name: "Pisces" }
    ];

    const zodiacSign = zodiacSigns.find(sign => {
        const [startMonth, startDay] = sign.monthStart;
        const [endMonth, endDay] = sign.monthEnd;
        return (monthIndex === startMonth && day >= startDay) ||
            (monthIndex === endMonth && day <= endDay);
    });

    return zodiacSign?.name || null;
}

/**
 * This function takes a date of birth and returns the horoscope sign based on the date.
 *
 * @param {Date} dateOfBirth - The date of birth of the person
 * @return {Object} An object containing the horoscope sign
 */
export function detectChineseZodiac(dateOfBirth: DateType): string | null {
    if (!dateOfBirth) return null;
    if (!dayjs(dateOfBirth).isValid()) return null;
    const date = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
    return CHINESE_ZODIAC_SIGNS.find(sign => {
        if (!sign.rangeDate[0] || !sign.rangeDate[1]) return false;
        return date >= sign.rangeDate[0] && date <= sign.rangeDate[1]
    })?.animal || null;
}

