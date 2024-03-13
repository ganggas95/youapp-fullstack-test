import { deepCopy, shallow } from '../shallow.utils';

describe('deepCopy', () => {
    it('should make a deep copy of an object', () => {
        const obj = { name: 'John', age: 25 };
        const copy = deepCopy(obj);

        expect(copy).toEqual(obj);
        expect(copy).not.toBe(obj);
    });

    it('should make a deep copy of an array', () => {
        const arr = [1, 2, 3, 4];
        const copy = deepCopy(arr);

        expect(copy).toEqual(arr);
        expect(copy).not.toBe(arr);
    });

    it('should make a deep copy of nested objects and arrays', () => {
        const data = {
            name: 'John',
            age: 25,
            friends: [
                { name: 'Jane', age: 23 },
                { name: 'Bob', age: 27 },
            ],
        };
        const copy = deepCopy(data);

        expect(copy).toEqual(data);
        expect(copy).not.toBe(data);
        expect(copy.friends).toEqual(data.friends);
        expect(copy.friends).not.toBe(data.friends);
    });
});

describe('shallow', () => {
    it('should return an object with selected fields from the source object', () => {
        const source = { a: 1, b: 2, c: 3 };
        const fields = ['a', 'c'];
        const result = shallow({ source, fields });
        expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should replace the field names as specified in the fieldsReplace parameter', () => {
        const source = { a: 1, b: 2, c: 3 };
        const fields = ['a', 'c'];
        const fieldsReplace = { a: 'x', c: 'y' };
        const result = shallow({ source, fields, fieldsReplace });
        expect(result).toEqual({ x: 1, y: 3 });
    });

    it('should exclude fields specified in the exceptFields parameter', () => {
        const source = { a: 1, b: 2, c: 3 };
        const fields = ['a', 'b', 'c'];
        const exceptFields = ['b'];
        const result = shallow({ source, fields, exceptFields });
        expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should return an empty object if no fields are selected', () => {
        const source = { a: 1, b: 2, c: 3 };
        const fields = [];
        const result = shallow({ source, fields });
        expect(result).toEqual({});
    });

    it('should return an empty object if source object is empty', () => {
        const source = {};
        const fields = ['a', 'b', 'c'];
        const result = shallow({ source, fields });
        expect(result).toEqual({});
    });
});