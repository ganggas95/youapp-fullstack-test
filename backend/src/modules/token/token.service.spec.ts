import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { UserService } from '@/api/user/user.service';

import { TOKEN_OPTIONS } from './constants/token.constants';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  const mockUserService = {
    findUserByUsernameOrEmail: jest.fn(),
  }
  const mockJwtService = {
    verifyAsync: jest.fn()
  }
  const mockTokenOptions = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, {
        provide: UserService,
        useValue: mockUserService
      }, {
          provide: JwtService,
          useValue: mockJwtService
        }, {
          provide: TOKEN_OPTIONS,
          useValue: mockTokenOptions
        }],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("verifyToken", () => {
    it('should throw UnauthorizedException when no token is provided', async () => {
      // Act and Assert
      await expect(service.verifyToken(null)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      // Arrange
      const verifyResult =
        { username: 'testuser', email: 'test@example.com' }
      mockUserService.findUserByUsernameOrEmail.mockResolvedValue(null);
      mockJwtService.verifyAsync.mockResolvedValue(verifyResult);
      // Act and Assert
      await expect(service.verifyToken('validtoken')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user document when token is valid and user is found', async () => {
      // Arrange
      const userDocument = {
        _id: new Types.ObjectId(),
        username: 'testuser',
        email: 'test@example.com'
      };
      const verifyResult = { username: 'testuser', email: 'test@example.com' };
      mockUserService.findUserByUsernameOrEmail.mockResolvedValue(userDocument);
      mockJwtService.verifyAsync.mockResolvedValue(verifyResult);
      
      // Act
      const result = await service.verifyToken('validtoken');
      
      // Assert
      expect(result).toBe(userDocument);
    });
  })
});
