import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../user/user.service';
import { DeleteAccountDto, ProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  const mockUserService = {
    findUserByUsername: jest.fn(),
    saveUser: jest.fn(),
    deleteUser: jest.fn(),

  };

  const mockRequest = {
    currentUser: {
      username: "username"
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService,
        {
          provide: REQUEST,
          useValue: mockRequest
        },
        {
          provide: UserService,
          useValue: mockUserService
        }],
    }).compile();

    service = await module.resolve<ProfileService>(ProfileService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      // Arrange
      jest.spyOn(mockUserService, "findUserByUsername").mockResolvedValue(
        mockRequest.currentUser);
      // Act and Assert
      expect(await service.getProfile()).toEqual(mockRequest.currentUser);
    });
  })

  describe("updateProfile", () => {
    it("should return updated user profile", async () => {
      // Arrange
      const payload = {
        name: "test",
        gender: "test",
        avatar: "test",
        birthday: new Date(),
        interests: ["test"],
        weight: 0,
        height: 0
      } as ProfileDto
      jest.spyOn(service, "getProfile").mockResolvedValue(mockRequest.currentUser as any);
      jest.spyOn(mockUserService, "saveUser").mockResolvedValue({
        ...mockRequest.currentUser,
        ...payload,
      });

      // Act
      const result = await service.updateProfile(payload);

      // Assert
      expect(result.name).toEqual(payload.name);
      expect(result.gender).toEqual(payload.gender);
      expect(result.avatar).toEqual(payload.avatar);
      expect(result.birthday).toEqual(payload.birthday);
      expect(result.interests).toEqual(payload.interests);
      expect(result.weight).toEqual(payload.weight);
      expect(result.height).toEqual(payload.height);
      expect(result.zodiac).not.toBeNull();
      expect(result.horoscope).not.toBeNull();
    });

    it("should rejected if profile not found", async () => {
      // Arrange
      const payload = {} as ProfileDto
      jest.spyOn(service, "getProfile").mockResolvedValue(null);

      // Act
      try {
        await service.updateProfile(payload);
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("Profile not found"));
      }
    });
  })

  describe("deleteProfile", () => {
    it('should delete profile when user exists and credentials are correct', async () => {
      // Arrange
      const deleteProfile: DeleteAccountDto = {
        username: 'testuser',
        password: 'testpassword'
      };
      jest.spyOn(service, 'getProfile').mockResolvedValue({
        username: 'testuser',
        validatePassword: (password: string) => password === 'testpassword'
      } as any);
      jest.spyOn(mockUserService, 'deleteUser').mockResolvedValue({

      });

      // Act
      await expect(service.deleteProfile(deleteProfile)).resolves.toBeUndefined();

      // Assert
      expect(service.getProfile).toHaveBeenCalledTimes(1);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('testuser');
    });

    it('should throw a base error when user profile does not exist', async () => {
      // Arrange
      const deleteProfile: DeleteAccountDto = {
        username: 'testuser',
        password: 'testpassword'
      };
      jest.spyOn(service, 'getProfile').mockResolvedValue(null);

      // Act and Assert
      await expect(service.deleteProfile(deleteProfile)).rejects.toThrow();
    });

    it('should throw a base error when password is correct but username is incorrect', async () => {
      // Arrange
      const deleteProfile: DeleteAccountDto = {
        username: 'testuser12',
        password: 'correctpassword'
      };
      jest.spyOn(service, 'getProfile').mockResolvedValue({
        username: 'testuser',
        validatePassword: (password: string) => password === 'correctpassword'
      } as any);

      // Act and Assert
      await expect(service.deleteProfile(deleteProfile)).rejects.toThrow();
    });

    it('should throw a base error when username is correct but password is incorrect', async () => {
      // Arrange
      const deleteProfile: DeleteAccountDto = {
        username: 'testuser',
        password: 'incorrectpassword'
      };
      jest.spyOn(service, 'getProfile').mockResolvedValue({
        username: 'testuser',
        validatePassword: (password: string) => password === 'testpassword'
      } as any);

      // Act and Assert
      await expect(service.deleteProfile(deleteProfile)).rejects.toThrow();
    });
  })

})
