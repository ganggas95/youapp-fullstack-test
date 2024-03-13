import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '@/api/user/schemes/user.scheme';

import { Message } from './message.scheme';

@Schema()
export class Conversation {

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
    users: User[];

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }])
    messages: Message[]

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}


export type ConversationDocument = HydratedDocument<Conversation>;
export const ConversationSchema = SchemaFactory.createForClass(Conversation)