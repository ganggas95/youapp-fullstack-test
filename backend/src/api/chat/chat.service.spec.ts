import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { User, UserDocument } from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import {
  Conversation,
  ConversationDocument
} from './schemes/conversation.scheme';
import { Message } from './schemes/message.scheme';

describe('ChatService', () => {
  let service: ChatService;
  const mockConversationRepository = {
    constructor: jest.fn(),
    where: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockReturnThis()
    })),
    findOne: jest.fn()
  }
  const mockMessageRepository = {};
  const mockUserService = {
    findUserById: jest.fn()
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Conversation.name),
          useValue: mockConversationRepository
        }, {
          provide: getModelToken(Message.name),
          useValue: mockMessageRepository
        }, {
          provide: UserService,
          useValue: mockUserService
        }],
    }).compile();

    service = module.get<ChatService>(ChatService);

  });

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConversations', () => {
    it('should return an array of ConversationDocument objects', async () => {
      // Arrange
      const userId = new Types.ObjectId();  // Create a new ObjectId for testing
      mockConversationRepository["where"] = jest.fn(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      })) as any
      // Act
      const conversations = await service.getConversations(userId);

      // Assert
      expect(conversations).toBeInstanceOf(Array);
      expect(conversations.length).toBeGreaterThanOrEqual(0);
      conversations.forEach((conversation: ConversationDocument) => {
        expect(conversation).toBeInstanceOf(Conversation);
      });
    });

    it('should correctly filter conversations by userId', async () => {
      // Arrange
      const userId = new Types.ObjectId(); // Create a new ObjectId for testing

      // Act
      const conversations = await service.getConversations(userId);

      // Assert
      conversations.forEach((conversation: ConversationDocument) => {
        expect(conversation.users).toContain(userId);
      });
    });
  });

  describe("findConversationWithFriend", () => {

    it('findConversationWithFriend - should find a conversation between two existing users', async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const friendId = new Types.ObjectId();
      mockConversationRepository["findOne"] = jest.fn(() => ({
        exec: jest.fn().mockResolvedValue(new Conversation())
      }))

      // Act
      const conversation = await service.findConversationWithFriend(userId, friendId);

      // Assert
      expect(conversation).toBeDefined();
    });

    it('findConversationWithFriend - should not find a conversation when one or both users do not exist', async () => {
      const userId = new Types.ObjectId();
      const nonExistentFriendId = new Types.ObjectId();

      mockConversationRepository["findOne"] = jest.fn(() => ({
        exec: jest.fn().mockResolvedValue(null)
      }))
      const conversation = await service.findConversationWithFriend(userId, nonExistentFriendId);
      expect(conversation).toBeNull();
    });
  });

  describe('findOrCreateConversation', () => {
    it('should return existing conversation if it exists', async () => {
      // Arrange
      const user = new User() as UserDocument;
      const friend = new User() as UserDocument;

      mockUserService.findUserById = jest.fn(() => (user))

      mockConversationRepository["findOne"] = jest.fn(() => ({
        exec: jest.fn().mockResolvedValue(new Conversation())
      }))
      // Act
      const conversation = await service.findOrCreateConversation(user, friend)

      // Assert
      expect(conversation).toBeInstanceOf(Conversation);
    });

    it('should create a new conversation if it does not exist and users are found', async () => {
      // Arrange
      const user = new User() as UserDocument;
      const friend = new User() as UserDocument;

      mockUserService.findUserById = jest.fn((_id) => ({
        _id
      }))

      jest.spyOn(service, 'findConversationWithFriend').mockImplementation(() => {
        return new Promise(resolve => resolve(null))
      });

      // Assume that mockConversationRepository is class so we need to mock constructor call
      // mock the constructor to return an instance of Conversation
      (service as any).conversationModel = jest.fn(() => ({
        save: jest.fn().mockResolvedValue(new Conversation())
      }))

      // Act
      const conversation = await service.findOrCreateConversation(user, friend)

      // Assert
      expect(conversation).toBeInstanceOf(Conversation);
    });
  });

  describe('createMessage', () => {
    // Arrange
    const friendId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId()

    it('throws an error if the friend is not found', async () => {
      // Arrange
      jest.spyOn(mockUserService, "findUserById").mockResolvedValue(null)

      await expect(service.createMessage(userId, { friendId: friendId, message: 'Hello' }))
        .rejects.toThrow('Friend not found');
    });

    it('creates a message and conversation correctly', async () => {
      // Arrange

      const payloadMessage = { friendId, message: 'Hello' };
      jest.spyOn(mockUserService, "findUserById").mockImplementation((_id) => Promise.resolve({
        _id
      }));

      const messageResult = {
        _id: new Types.ObjectId,
        message: 'Hello',
        createdAt: new Date(),
        user: {
          _id: userId
        }
      } as any;
      (service as any).messageModel = jest.fn(() => ({
        save: jest.fn().mockResolvedValue(messageResult)
      }))

      const conversationResultMock = {
        _id: new Types.ObjectId(),
        messages: [messageResult],
        users: [],
        createdAt: new Date(),
      }

      jest.spyOn(service, 'findOrCreateConversation').mockResolvedValue({
        ...conversationResultMock,
        save: jest.fn(() => Promise.resolve(conversationResultMock))
      } as any)


      //ACT
      const [message, conversation] = await service.createMessage(
        userId, payloadMessage);

      // Assert
      expect(mockUserService.findUserById).toHaveBeenCalledTimes(2)
      expect(service.findOrCreateConversation).toHaveBeenCalledTimes(1);
      expect(message.message).toEqual("Hello");
      expect(conversation.messages.length).toBeGreaterThan(0)
    });
  });
});
