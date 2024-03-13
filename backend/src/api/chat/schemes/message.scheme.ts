

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '@/api/user/schemes/user.scheme';

export type MessageDocument = HydratedDocument<Message>;
@Schema()
export class Message {
    @Prop()
    message: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop()
    createdAt: Date;


    @Prop()
    updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message)