import { ObjectId } from '@/interfaces/mongo.iface';

import { ObjectId as ObjectID } from 'mongodb';

export const toObjectId = (value: string | ObjectId): ObjectId => {
    return typeof value === 'string' ? new ObjectID(value) : value
}