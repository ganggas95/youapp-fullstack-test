import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { Socket } from 'socket.io';

import { TokenService } from '@/modules/token/token.service';

import * as sinon from 'sinon';

import { User, UserDocument } from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';
import { ConversationSocketIface } from './interfaces/chat.iface';
import { ConversationDocument } from './schemes/conversation.scheme';
import { MessageDocument } from './schemes/message.scheme';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  const mockTokenService = {
    verifyToken: jest.fn((token: string) => {
      return Promise.resolve({ id: 1, name: 'John' });
    })
  };
  const mockUserService = {
    getUsers: jest.fn(),
  };
  const mockChatService = {
    findOrCreateConversation: jest.fn(),
    getConversations: jest.fn(),
    createMessage: jest.fn(),
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
        ChatGateway,
        {
          provide: TokenService,
          useValue: mockTokenService
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: ChatService,
          useValue: mockChatService
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache
        }
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    } as any
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {

    it('should set user and perform conversation related actions when valid token is provided', async () => {
      // Arrange
      const user = { id: 1, name: 'John' };
      jest.spyOn(mockTokenService, 'verifyToken').mockResolvedValue(user);

      const spySetConversationUser = jest.spyOn(gateway, 'setConversationUser')
        .mockImplementation((sock, user) => Promise.resolve());

      const spyCreateRoom = jest.spyOn(gateway, 'createConversationRoom')
        .mockImplementation((user) => Promise.resolve());

      const spyGetConversations = jest.spyOn(gateway, 'getConversations')
        .mockImplementation((socket) => Promise.resolve());

      // Act
      await gateway.handleConnection(socket);

      // Assert
      expect(socket.data.user).toBe(user);
      expect(spySetConversationUser).toHaveBeenCalledWith(socket, user);
      expect(spyCreateRoom).toHaveBeenCalledWith(user);
      expect(spyGetConversations).toHaveBeenCalledWith(socket);
      // add more assertions for other actions related to conversation
    });

    it('should disconnect socket when invalid token is provided', async () => {
      // Arrange
      jest.spyOn(mockTokenService, 'verifyToken').mockResolvedValue(null);
      const disconnectSpy = jest.spyOn(gateway, 'handleDisconnect');

      // Act
      await gateway.handleConnection(socket);
      // Assert
      expect(disconnectSpy).toHaveBeenCalledWith(socket);
    });

    it('should disconnect socket and throw error when exception is thrown during token verification', async () => {
      // Arrange
      jest.spyOn(mockTokenService, 'verifyToken').mockRejectedValue(new Error('Token verification failed'));
      const disconnectSpy = jest.spyOn(gateway, 'handleDisconnect')
        .mockImplementation(() => Promise.resolve());
      // Act
      await gateway.handleConnection(socket)

      // Assert
      expect(disconnectSpy).toHaveBeenCalledWith(socket);
    });
  });

  describe('setConversationUser', () => {
    it('should set conversation user with valid socket and user', async () => {
      // Arrange
      const socket = { id: new Types.ObjectId().toString() } as Socket;
      const user = { _id: new Types.ObjectId() } as UserDocument;

      const expectedConversationUser: ConversationSocketIface = {
        userId: user._id.toString(),
        socketId: socket.id
      };

      // Act
      await gateway.setConversationUser(socket, user);


      // Assert
      expect(mockCache.set).toHaveBeenCalledWith(
        `conversation ${user._id.toString()}`,
        expectedConversationUser
      );
    });
  });

  describe("getConversationUser", () => {
    it('createConversationRoom', async () => {
      // Arrange
      const user = { username: 'user1' } as UserDocument;

      jest.spyOn(mockUserService, 'getUsers').mockResolvedValue([
        { username: 'friend1' },
        { username: 'friend2' }
      ])
      // Act
      await gateway.createConversationRoom(user);
      // Assert
      expect(mockUserService.getUsers).toHaveBeenCalledWith(user.username);
      expect(mockChatService.findOrCreateConversation).toHaveBeenCalledWith(user, { username: 'friend1' });
      expect(mockChatService.findOrCreateConversation).toHaveBeenCalledWith(user, { username: 'friend2' });
    });
  });

  describe('getActiveUser', () => {
    it('should return ConversationSocketIface for a valid userId', async () => {
      // Arrange
      const userId = new Types.ObjectId().toString();
      jest.spyOn(mockCache, 'get').mockResolvedValue({ userId: '1', socketId: '2' });
      // Act
      const result = await gateway.getActiveUser(userId);
      // Assert
      expect(result).toEqual({ userId: '1', socketId: '2' });
      expect(mockCache.get).toHaveBeenCalledWith(`conversation ${userId}`);
    });
  });

  describe('getConversations', () => {

    it('should emit all conversations when user is defined', async () => {
      // Arrange
      const user = { _id: new Types.ObjectId() } as UserDocument | User;
      socket.data.user = user;
      const conversations = [{ _id: new Types.ObjectId(), users: [user], messages: [] }] as ConversationDocument[];
      jest.spyOn(mockChatService, 'getConversations').mockResolvedValue(conversations);

      const emitSpy = jest.spyOn(gateway.server, 'to').mockReturnThis();

      // Act
      await gateway.getConversations(socket);

      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit conversations when user is undefined', async () => {
      // Arrange
      socket.data.user = undefined;
      const getConversationsSpy = jest.spyOn(mockChatService, 'getConversations');
      // Act
      await gateway.getConversations(socket);
      // Assert
      expect(getConversationsSpy).not.toHaveBeenCalled();
    });
  });


  describe('ping method', () => {
    it('should not do anything if the socket is missing the data property', async () => {
      // Arrange
      socket.data = {};

      // Act
      await gateway.ping(socket);
      // Add assertion here
      // Nothing todo because empty data provided
    });

    it('should call setConversationUser if active user is not found', async () => {
      // Arrange
      socket.data = {
        user: {
          _id: new Types.ObjectId(),
        }
      }
      const spyGetActiveUser = jest.spyOn(gateway, 'getActiveUser').mockResolvedValue(null)
      const spySetConversationUser = jest.spyOn(gateway, 'setConversationUser');

      // Act
      await gateway.ping(socket);

      // Assert
      expect(spyGetActiveUser).toHaveBeenCalledWith(socket.data.user._id.toString());
      expect(spySetConversationUser).toHaveBeenCalledWith(socket, socket.data.user);
    });

    it('should not call setConversationUser if active user is found', async () => {
      // Arrange
      socket.data = {
        user: {
          _id: new Types.ObjectId(),
        }
      }
      const spyGetActiveUser = jest.spyOn(gateway, 'getActiveUser').mockResolvedValue({
        ...socket.data.user,
        socketId: socket.id
      })
      const spySetConversationUser = jest.spyOn(gateway, 'setConversationUser');

      // Act
      await gateway.ping(socket);

      // Assert
      expect(spyGetActiveUser).toHaveBeenCalledWith(socket.data.user._id.toString());
      expect(spySetConversationUser).toHaveBeenCalledTimes(0);
    });
  });

  describe("handleMessage", () => {
    afterEach(()=>{
      jest.clearAllMocks();
    })
    it("Should not do anything if payload is empty", async () => {
      // Arrange
      const payload = undefined;
      const spySetConversation = jest.spyOn(gateway, "setConversationUser");
      // Act
      await gateway.handleMessage(socket, payload as MessageDto);
      // Assert
      expect(spySetConversation).toHaveBeenCalledTimes(0);
    })

    it("Should be not do anything if user is not defined", async () => {
      // Arrange
      socket.data.user = undefined;
      const spySetConversation = jest.spyOn(gateway, "setConversationUser");
      // Act
      await gateway.handleMessage(socket, {} as MessageDto);
      // Assert
      expect(spySetConversation).toHaveBeenCalledTimes(0);
    })

    it("Should be set conversation if user is defined", async () => {
      // Arrange
      socket.data.user = {
        _id: new Types.ObjectId(),
      } as UserDocument;

      const payload = {
        friendId: new Types.ObjectId().toString(),
        message: "test"
      } as MessageDto;
      const newMessage = {
        _id: new Types.ObjectId(),
        message: "test",
        user: socket.data.user
      } as MessageDocument

      const conversation = {
        _id: new Types.ObjectId(),
        users: [socket.data.user, { _id: new Types.ObjectId(payload.friendId) }] as User[],
        messages: [newMessage],
        createdAt: new Date(),
        updatedAt: null
      } as any;
      const spySetConversation = jest.spyOn(gateway, "setConversationUser");
      const spyCreateMessage = jest.spyOn(mockChatService, "createMessage").mockResolvedValueOnce([
        newMessage,
        conversation,
      ]);
      // Act
      await gateway.handleMessage(socket, payload);
      // Assert
      expect(spySetConversation).toHaveBeenCalledTimes(1);
      expect(spyCreateMessage).toHaveBeenCalledTimes(1);
      expect(spyCreateMessage).toHaveBeenCalledWith(
        socket.data.user._id, payload);
    })

  })
});
