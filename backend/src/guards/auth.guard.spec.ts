import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenService } from '@/modules/token/token.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  const mockTokenService = {
    verifyToken: jest.fn()
  }
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        AuthGuard,
      ],
    })
      .compile();
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe("canActive", () => {
    it('should return true for valid token', async () => {
      // Arrange
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer validToken' },
          }),
        }),
      } as ExecutionContext;
      jest.spyOn(mockTokenService, 'verifyToken').mockResolvedValue(true);

      // Act
      const result = await authGuard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer invalidToken' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(mockTokenService, 'verifyToken').mockRejectedValue(false);

      // Act and Assert
      await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for no token provided', async () => {
      // Arrange
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as ExecutionContext;

      // Act and Assert
      await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for token verification error', async () => {
      // Arrange
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer validToken' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(authGuard['tokenService'], 'verifyToken').mockRejectedValueOnce(new Error('Verification failed'));

      // Act and Assert
      await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  })

});
