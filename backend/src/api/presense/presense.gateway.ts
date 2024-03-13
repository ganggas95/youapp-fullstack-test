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

import { OnlineUserIface } from '@/api/presense/interfaces/presense.iface';
import { CustomCacheInterceptor } from '@/interceptors/cache.interceptor';
import { TokenService } from '@/modules/token/token.service';

import { UserDocument } from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';

const SOCKET_PORT = process.env.NODE_ENV === 'test' ? undefined : 8888
@WebSocketGateway(SOCKET_PORT, { cors: true })
@UseInterceptors(CustomCacheInterceptor)
export class PresenseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache) {
  }

  @WebSocketServer()
  server: Server;

  async handleDisconnect(socket: Socket) {
    await this.setOnlineStatus(socket, false);
  }
  // async onModuleInit() {
  //   await this.cache.reset();
  // }
  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization ?? null;
    try {
      const user = await this.tokenService.verifyToken(token);
      socket.data.user = user;
      await this.setOnlineStatus(socket, true)

    } catch (error) {
      this.handleDisconnect(socket);
      // throw error
    }

  }

  async setOnlineStatus(socket: Socket, isOnline: boolean) {
    const user: UserDocument | undefined = socket.data?.user;
    if (!user) return;
    const onlineUser: OnlineUserIface = {
      id: user._id.toString(),
      socketId: socket.id,
      isOnline
    }

    await this.cache.set(`user ${user._id.toString()}`, onlineUser);
    await this.emitStatusToUsers(onlineUser)
  }

  async emitStatusToUsers(onlineUser: OnlineUserIface) {
    const users = await this.userService.getUsers();
    users.forEach(async user => {
      if (user._id.toString() !== onlineUser.id) {
        const friend: OnlineUserIface = await this.cache.get(`user ${user._id.toString()}`);
        if (friend) {
          this.server.to(friend.socketId).emit('onlineUser', {
            id: onlineUser.id,
            isOnline: onlineUser.isOnline
          });
          if (onlineUser.isOnline) {
            this.server.to(onlineUser.socketId).emit('onlineUser', {
              id: friend.id,
              isOnline: friend.isOnline
            });
          }
        }
      }
    })
  }


  @SubscribeMessage('ping')
  async handlePing(socket: Socket) {
    await this.setOnlineStatus(socket, true)
    return;
  }

  @SubscribeMessage('setOnline')
  async handleSetOnline(socket: Socket, isOnline: boolean): Promise<void> {
    if (!socket.data?.user) return;

    await this.setOnlineStatus(socket, isOnline)
  }
}
