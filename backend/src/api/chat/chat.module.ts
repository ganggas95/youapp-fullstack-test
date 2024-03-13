import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from '../user/user.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import {
  Conversation,
  ConversationSchema
} from './schemes/conversation.scheme';
import { Message, MessageSchema } from './schemes/message.scheme';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Message.name, schema: MessageSchema },
    { name: Conversation.name, schema: ConversationSchema },
  ])],
  providers: [UserService, ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [MongooseModule]
})
export class ChatModule { }
