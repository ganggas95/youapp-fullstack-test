import { HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { TokenService } from '@/modules/token/token.service';

import { UserResponseDto } from './dto/user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const mockRequest = {
    currentUser: {
      username: "username"
    }
  }
  const mockUserService = {
    getUsers: jest.fn(),
    findUserById: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: REQUEST,
          useValue: mockRequest
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: TokenService,
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("getUsers", () => {
    it('should be success get users', async () => {
      // Arrange
      const mockUsers = [{
        _id: new Types.ObjectId(),
        username: 'testUser',
        email: 'testUser@email.com',
        password: 'testUser'
      }]
      jest.spyOn(mockUserService, "getUsers").mockResolvedValue(mockUsers);

      // Act
      const result = await controller.getUsers();

      // Assert
      expect(result.data.length).toEqual(1);
      expect(mockUserService.getUsers).toHaveBeenCalledTimes(1);
    })
    it('should be rejected', async () => {
      // Arrange
      jest.spyOn(mockUserService, "getUsers").mockRejectedValue(new Error("Database error"));

      // Act
      try {
        await controller.getUsers();
      } catch (error) {
        expect(error.message).toEqual("Database error");
      }
    })
  });

  describe("getDetailUser", () => {
    it('should be success get detail user', async () => {
      // Arrange
      const userId = new Types.ObjectId().toString()
      const mockUser = {
        _id: "id"
      } as any
      jest.spyOn(mockUserService, "findUserById").mockResolvedValue(mockUser as any);
      // Act
      const result = await controller.getDetailUser(userId);

      // Assert
      expect(result).toEqual({
        data: new UserResponseDto(mockUser),
        message: 'Get detail user successfully'
      })
    })
    it('should be failed and response error 404', async () => {
      // Arrange
      const userId = new Types.ObjectId().toString()
      jest.spyOn(mockUserService, "findUserById").mockResolvedValue(null);
      // Act
      try {
        const result = await controller.getDetailUser(userId);
      } catch (error) {
        // Assert
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      }
    })
  })
});
