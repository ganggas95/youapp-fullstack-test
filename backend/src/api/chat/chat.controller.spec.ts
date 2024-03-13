import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { TokenService } from '@/modules/token/token.service';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;
  const mockTokenService = {};
  const mockChatService = {
    getConversations: jest.fn(),
    findConversationWithFriend: jest.fn()
  };

  const mockRequest = {
    currentUser: {
      _id: new Types.ObjectId(),
      username: "username"
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService
        },
        {
          provide: TokenService,
          useValue: mockTokenService
        },
        {
          provide: REQUEST,
          useValue: mockRequest
        }
      ]
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("getConversations", () => {
    it('should be success get conversations', async () => {
      // Arrange
      const mockConversations = [{
        _id: "id",
        users: ["id"],
        messages: []
      }]
      jest.spyOn(mockChatService, "getConversations")
        .mockResolvedValue(mockConversations)

      // Act
      const result = await controller.getConversations();

      // Assert
      expect(result.data.length).toEqual(1)
      expect(mockChatService.getConversations).toHaveBeenCalledTimes(1)
      expect(mockChatService.getConversations).toHaveBeenCalledWith(
        mockRequest.currentUser._id)

    });
    it('should be rejecteds get conversations', async () => {
      // Arrange
      jest.spyOn(mockChatService, "getConversations")
        .mockRejectedValue(new Error("Database error"))
      // Act
      try {
        await controller.getConversations();
      } catch (error) {
        // Assert
        expect(error.message).toEqual("Database error")
      }
    });
  });

  describe("findConversationWithFriend", () => {
    it('should be success find conversation with friend', async () => {
      // Arrange
      const friendId = new Types.ObjectId()
      const mockConversation = {
        _id: "id",
        users: ["id"],
        messages: [{
          _id: "id",
          message: "message",
          createdAt: new Date(),
          user: {
            _id: "id"
          }
        }]
      }
      jest.spyOn(mockChatService, "findConversationWithFriend")
        .mockResolvedValue(mockConversation);

      // Act
      const result = await controller.findConversationsWithFriend(friendId.toString());

      // Assert
      expect(result.data.id).toEqual(mockConversation._id)
      expect(mockChatService.findConversationWithFriend).toHaveBeenCalledTimes(1)
      expect(mockChatService.findConversationWithFriend).toHaveBeenCalledWith(
        mockRequest.currentUser._id, friendId)
    });
    it('should be success and return null if not found', async () => {
      // Arrange
      const friendId = new Types.ObjectId()
      const mockConversation = {
        _id: "id",
        users: ["id"],
        messages: []
      }
      jest.spyOn(mockChatService, "findConversationWithFriend")
        .mockResolvedValue(null);

      // Act
      const result = await controller.findConversationsWithFriend(
        friendId.toString());

      // Assert
      expect(result.data).toEqual(null)
      expect(mockChatService.findConversationWithFriend).toHaveBeenCalledTimes(1)
      expect(mockChatService.findConversationWithFriend).toHaveBeenCalledWith(
        mockRequest.currentUser._id, friendId)
    });

    it('should be rejecteds get conversation with friend', async () => {
      // Arrange
      const friendId = "InvalidID"
      // Act
      try {
        await controller.findConversationsWithFriend(friendId);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(Error)
      }
    });
  });
});
