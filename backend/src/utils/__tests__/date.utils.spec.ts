import { calculateAge, formatDate, stringToDate } from '../date.utils';

describe('formatDate', () => {
    it('should return formatted date with default format for valid date input', () => {
        const date = new Date('2022-01-01T00:00:00');
        expect(formatDate(date)).toEqual('01/01/2022'); // assuming defaultFormat is 'MM/DD/YYYY'
    });

    it('should return formatted date with custom format for valid date input', () => {
        const date = new Date('2022-01-01T00:00:00');
        expect(formatDate(date, 'YYYY-MM-DD')).toEqual('2022-01-01');
    });

    it('should return "-" for invalid date input', () => {
        const date = null;
        expect(formatDate(date)).toEqual('-');
    });

    it('should return "-" for missing date input', () => {
        expect(formatDate(null)).toEqual('-');
    });
});

describe("stringToDate", () => {
    it('stringToDate with valid date and default format', () => {
        const expectedResult = new Date('2022-12-31');
        const result = stringToDate('2022-12-31');
        expect(result.getDate()).toEqual(expectedResult.getDate());
        expect(result.getMonth()).toEqual(expectedResult.getMonth());
        expect(result.getFullYear()).toEqual(expectedResult.getFullYear());
    });

    it('stringToDate with valid date and custom format', () => {
        const expectedResult = new Date('2022-12-31');
        const result = stringToDate('12/31/2022', 'MM/DD/YYYY');
        expect(result.getDate()).toEqual(expectedResult.getDate());
        expect(result.getMonth()).toEqual(expectedResult.getMonth());
        expect(result.getFullYear()).toEqual(expectedResult.getFullYear());
    });

    it('stringToDate with invalid date', () => {
        const result = stringToDate('invalid date');
        expect(result).toBeNull();
    });

    it('stringToDate with empty date', () => {
        const result = stringToDate('');
        expect(result).toBeNull();
    });
});

describe("calculateAge", () => {
    it('calculateAge with a valid date', () => {
        const date = new Date('1990-01-01');
        expect(calculateAge(date)).toBe(34);
    });

    it('calculateAge with an invalid date', () => {
        expect(calculateAge(null)).toBe("");
    });

    it('calculateAge with a future date', () => {
        const date = new Date('2050-01-01');
        expect(calculateAge(date)).toBeLessThan(0);
    });

    it('calculateAge with a past date', () => {
        const date = new Date('1970-01-01');
        expect(calculateAge(date)).toBeGreaterThan(0);
    });
})