import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { TokenService } from '@/modules/token/token.service';
import { toObjectId } from '@/utils/transformId.utils';

import * as sinon from 'sinon';

import { UserService } from '../user/user.service';
import { OnlineUserIface } from './interfaces/presense.iface';
import { PresenseGateway } from './presense.gateway';

describe('PresenseGateway', () => {
  let gateway: PresenseGateway;
  const mockTokenService = {
    verifyToken: jest.fn(),
  };
  const mockUserService = {
    getUsers: jest.fn().mockResolvedValue([]),
  };
  const mockCache = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const socket = {
    id: new Types.ObjectId().toString(),
    emit: sinon.spy(),
    handshake: {
      headers: {
        authorization: 'token'
      }
    },
    to: sinon.spy(),
    send: sinon.spy(),
    data: {}
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresenseGateway,
        {
          provide: TokenService,
          useValue: mockTokenService
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache
        }],
    }).compile();

    gateway = module.get<PresenseGateway>(PresenseGateway);
    gateway.server = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    } as any
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sinon.restore();
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleDisconnect', () => {
    it('calls setOnlineStatus with false', async () => {
      // Arrange
      const setOnlineStatusMock = jest.spyOn(gateway, 'setOnlineStatus');
      // Act
      await gateway.handleDisconnect(socket);

      // Assert
      expect(setOnlineStatusMock).toHaveBeenCalledWith(socket, false);
      expect(setOnlineStatusMock).toHaveBeenCalledTimes(1)

    });
  });

  describe('handleConnection', () => {
    it("Should be call handleDisconnect if token is invalid", async () => {
      // Arrange
      jest.spyOn(mockTokenService, 'verifyToken').mockRejectedValue(new UnauthorizedException());
      const handleDisconnectMock = jest.spyOn(gateway, 'handleDisconnect');
      // Act
      await gateway.handleConnection(socket);
      // Assert
      expect(handleDisconnectMock).toHaveBeenCalledWith(socket);
      expect(handleDisconnectMock).toHaveBeenCalledTimes(1)
    })
    it('calls setOnlineStatus with true', async () => {
      // Arrange

      jest.spyOn(mockTokenService, 'verifyToken').mockResolvedValue({ _id: new Types.ObjectId() });

      jest.spyOn(mockTokenService, 'verifyToken').mockResolvedValue(null);

      const setOnlineStatusMock = jest.spyOn(gateway, 'setOnlineStatus');
      // Act
      await gateway.handleConnection(socket);

      // Assert
      expect(setOnlineStatusMock).toHaveBeenCalledWith(socket, true);
      expect(setOnlineStatusMock).toHaveBeenCalledTimes(1)
    })
  });

  describe("setOnlineStatus", () => {
    it("Should not do anything if user is not defined", async () => {
      socket.data.user = undefined;
      const spySetUserCache = jest.spyOn(mockCache, "set");
      // Act
      await gateway.setOnlineStatus(socket, true);
      // Assert
      expect(spySetUserCache).toHaveBeenCalledTimes(0);
    });

    it("Should be set user cache if user is defined and emitStatusToUsers is called ", async () => {
      // Arrange
      socket.data.user = {
        _id: new Types.ObjectId(),
      } as any;
      const onlineUser: OnlineUserIface = {
        id: socket.data.user._id.toString(),
        socketId: socket.id,
        isOnline: true
      }
      const spySetUserCache = jest.spyOn(mockCache, "set");
      const spyEmitStatusToUsers = jest.spyOn(gateway, "emitStatusToUsers");
      // Act
      await gateway.setOnlineStatus(socket, onlineUser.isOnline);
      // Assert
      expect(spySetUserCache).toHaveBeenCalledTimes(1);
      expect(spySetUserCache).toHaveBeenCalledWith(`user ${socket.data.user._id.toString()}`, onlineUser);
      expect(spyEmitStatusToUsers).toHaveBeenCalledTimes(1)
    })
  });

  describe("emitStatusToUsers", () => {
    it("Should be set online user to all users", async () => {
      // Arrange
      const onlineUser: OnlineUserIface = {
        id: new Types.ObjectId().toString(),
        socketId: socket.id,
        isOnline: true
      }

      const users = [
        { _id: toObjectId(onlineUser.id) },
        { _id: new Types.ObjectId() },
        { _id: new Types.ObjectId() },
      ]


      jest.spyOn(mockUserService, "getUsers").mockResolvedValue(users)
      const spyCacheGet = jest.spyOn(mockCache, "get").mockImplementation((key: string) => Promise.resolve(onlineUser))
      // Act
      await gateway.emitStatusToUsers(onlineUser);

      // Assert
      expect(spyCacheGet).toHaveBeenCalledTimes(2);
      expect(spyCacheGet).toHaveBeenNthCalledWith(1, `user ${users[1]._id.toString()}`);
      expect(spyCacheGet).toHaveBeenNthCalledWith(2, `user ${users[2]._id.toString()}`);

      expect(gateway.server.to).toHaveBeenCalledTimes(4);
      expect(gateway.server.emit).toHaveBeenCalledTimes(4);
    });
  });

  describe("handlePing", () => {
    it("should be call setOnlineStatus", () => {
      // Arrange
      const setOnlineStatusMock = jest.spyOn(gateway, 'setOnlineStatus');
      // Act
      gateway.handlePing(socket);
      // Assert
      expect(setOnlineStatusMock).toHaveBeenCalledWith(socket, true);
      expect(setOnlineStatusMock).toHaveBeenCalledTimes(1)
    })
  })

  describe("handlePing", () => {
    it("should be call setOnlineStatus", () => {
      // Arrange
      const setOnlineStatusMock = jest.spyOn(gateway, 'setOnlineStatus');
      // Act
      gateway.handlePing(socket);
      // Assert
      expect(setOnlineStatusMock).toHaveBeenCalledWith(socket, true);
      expect(setOnlineStatusMock).toHaveBeenCalledTimes(1)
    })
  })

  describe("handleSetOnline", () => {

    it("should be not do anything", () => {
      // Arrange
      socket.data.user = undefined;
      const setOnlineStatusMock = jest.spyOn(gateway, 'setOnlineStatus');
      // Act
      gateway.handleSetOnline(socket, true);
      // Assert
      expect(setOnlineStatusMock).toHaveBeenCalledTimes(0)
    })
    it("should be call setOnlineStatus", () => {
      // Arrange
      socket.data.user = {
        _id: new Types.ObjectId(),
      }
      const setOnlineStatusMock = jest.spyOn(gateway, 'setOnlineStatus');
      // Act
      gateway.handleSetOnline(socket, true);
      // Assert
      expect(setOnlineStatusMock).toHaveBeenCalledWith(socket, true);
      expect(setOnlineStatusMock).toHaveBeenCalledTimes(1)
    })
  })

});
