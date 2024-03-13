

import { Types } from 'mongoose';

import { toObjectId } from '../transformId.utils';

describe('toObjectId', () => {
  it('should convert a string to ObjectId', () => {
    const objectId = toObjectId('60a4a2f4f4a3c12f6833a1e9');
    expect(objectId).toBeInstanceOf(Types.ObjectId);
  });

  it('should handle ObjectId input', () => {
    const inputObjectId = new Types.ObjectId('60a4a2f4f4a3c12f6833a1e9');
    const objectId = toObjectId(inputObjectId);
    expect(objectId).toBeInstanceOf(Types.ObjectId);
    expect(objectId).toEqual(inputObjectId);
  });
});
