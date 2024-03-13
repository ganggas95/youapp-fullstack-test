import { detectChineseZodiac, detectZodiac } from '../zodiac-horoscope.utils';

describe("detectZodiac", () => {
    it('Detect Zodiac - With Null', () => {
        expect(detectZodiac(null)).toBeNull();
    });
    it('Detect Zodiac - Aries', () => {
        const date = new Date(2022, 2, 21);
        expect(detectZodiac(date)).toBe('Aries');
    });

    it('Detect Zodiac - Taurus', () => {
        const date = new Date(2022, 3, 20);
        expect(detectZodiac(date)).toBe('Taurus');
    });

    it('Detect Zodiac - Gemini', () => {
        const date = new Date(2022, 4, 21);
        expect(detectZodiac(date)).toBe('Gemini');
    });

    it('Detect Zodiac - Cancer', () => {
        const date = new Date(2022, 5, 21);
        expect(detectZodiac(date)).toBe('Cancer');
    });

    it('Detect Zodiac - Leo', () => {
        const date = new Date(2022, 6, 23);
        expect(detectZodiac(date)).toBe('Leo');
    });

    it('Detect Zodiac - Virgo', () => {
        const date = new Date(2022, 7, 23);
        expect(detectZodiac(date)).toBe('Virgo');
    });

    it('Detect Zodiac - Libra', () => {
        const date = new Date(2022, 8, 23);
        expect(detectZodiac(date)).toBe('Libra');
    });

    it('Detect Zodiac - Scorpio', () => {
        const date = new Date(2022, 9, 23);
        expect(detectZodiac(date)).toBe('Scorpio');
    });

    it('Detect Zodiac - Sagittarius', () => {
        const date = new Date(2022, 10, 22);
        expect(detectZodiac(date)).toBe('Sagittarius');
    });

    it('Detect Zodiac - Capricorn', () => {
        const date = new Date(2022, 11, 24);
        expect(detectZodiac(date)).toBe('Capricorn');
    });

    it('Detect Zodiac - Aquarius', () => {
        const date = new Date(2022, 0, 22);
        expect(detectZodiac(date)).toBe('Aquarius');
    });

    it('Detect Zodiac - Pisces', () => {
        const date = new Date(2022, 2, 20);
        expect(detectZodiac(date)).toBe('Pisces');
    });

    it('Detect Zodiac - Boundary between Pisces and Aries', () => {
        const date = new Date(2022, 2, 21);
        expect(detectZodiac(date)).toBe('Aries');
    });
})

describe('detectChineseZodiac', () => {
    it('should return the correct zodiac sign for a date that falls within the range of a specific zodiac sign', () => {
        const date = new Date('2022-02-12');
        expect(detectChineseZodiac(date)).toEqual('Tiger');
    });

    it('should return null for a date that does not fall within the range of any zodiac sign', () => {
        const date = new Date('2045-01-01');
        expect(detectChineseZodiac(date)).toBeNull();
    });

    it('should return null for a null date input', () => {
        expect(detectChineseZodiac(null)).toBeNull();
    });

    it('should return null for invalid date input', () => {
        expect(detectChineseZodiac('Invalid date')).toBeNull();
    });

    it('should return the correct zodiac sign for an edge case where the date falls exactly on the boundary of a zodiac sign range', () => {
        const date = new Date('2022-01-25');
        expect(detectChineseZodiac(date)).toEqual('Ox');
    });
});