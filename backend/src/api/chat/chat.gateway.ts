import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';

import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';

import { CustomCacheInterceptor } from '@/interceptors/cache.interceptor';
import { TokenService } from '@/modules/token/token.service';

import { UserDocument } from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { ConversationResponseDto } from './dto/conversation.dto';
import { MessageDto } from './dto/message.dto';
import { ConversationSocketIface } from './interfaces/chat.iface';

const SOCKET_PORT = process.env.NODE_ENV === 'test' ? undefined : 8889

@WebSocketGateway(SOCKET_PORT, { cors: true })
@UseInterceptors(CustomCacheInterceptor)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache) {
  }

  @WebSocketServer()
  server: Server;
  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization ?? null;
    console.log(token)
    try {
      const user = await this.tokenService.verifyToken(token);
      if (!user) {
        this.handleDisconnect(socket);
        return;
      }

      socket.data.user = user;

      await this.setConversationUser(socket, user)
      await this.createConversationRoom(user);
      await this.getConversations(socket)

    } catch (error) {
      this.handleDisconnect(socket);
      // throw error
    }
  }

  async setConversationUser(socket: Socket, user: UserDocument) {
    const conversationUser: ConversationSocketIface = {
      userId: user._id.toString(),
      socketId: socket.id
    }
    await this.cache.set(`conversation ${conversationUser.userId}`, conversationUser);
  }

  async createConversationRoom(user: UserDocument) {
    const users = await this.userService.getUsers(user.username);
    users.forEach(async friend => {
      await this.chatService.findOrCreateConversation(user, friend);
    })
  }

  // Use this for development process only
  // async onModuleInit() {
  //   await this.cache.reset();
  // }

  handleDisconnect(socket: Socket) {
    // console.log("Handle disconnect - conversation")
    return;
  }

  async getActiveUser(
    userId: string): Promise<ConversationSocketIface | undefined> {
    return await this.cache.get(`conversation ${userId}`);
  }


  @SubscribeMessage('getConversations')
  async getConversations(socket: Socket) {
    const user: UserDocument | undefined = socket.data?.user;
    if (!user) return;
    const conversations = await this.chatService.getConversations(user._id);
    this.server.to(socket.id).emit('getAllConversations',
      conversations.map(conv => new ConversationResponseDto(conv)));
  }

  @SubscribeMessage('ping')
  async ping(socket: Socket) {
    if (!socket.data?.user) return;
    const user: UserDocument = socket.data.user
    const activeUser = await this.getActiveUser(user._id.toString());
    if (!activeUser) {
      await this.setConversationUser(socket, socket.data?.user)
    }
    this.server.to(socket.id).emit('pong', "Pong");
    return;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, payload: MessageDto) {

    if (!payload) return;
    const user: UserDocument | undefined = socket.data?.user;
    if (!user) return;
    await this.setConversationUser(socket, user)

    const [message, conversation] = await this.chatService.createMessage(
      user._id, payload);

    const activeUser = await this.getActiveUser(payload.friendId);
    const payloadNewMessage = {
      id: message._id.toString(),
      message: message.message,
      user: user._id.toString(),
      createdAt: message.createdAt,
      conversationId: conversation._id.toString()
    }
    if (activeUser)
      this.server.to(activeUser.socketId).emit(
        'newMessage',
        payloadNewMessage);
    // Sent to my self
    this.server.to(socket.id).emit(
      'newMessage',
      payloadNewMessage);
  }
}
