import { Test, TestingModule } from '@nestjs/testing';

import { TokenService } from '@/modules/token/token.service';

import { UserDocument } from '../user/schemes/user.scheme';
import { DeleteAccountDto, ProfileDto } from './dto/profile.dto';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  const mockProfileService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    deleteProfile: jest.fn()
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService
        }, {
          provide: TokenService,
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("getProfile", () => {
    it("Should be success get profile", async () => {
      // Arrange, Act and Assert
      expect(await controller.getProfile()).toEqual({
        data: {},
        message: "Get profile successfully"
      })
    })

    it("Should be rejected get profile", async () => {
      // Arrange, Act and Assert
      jest.spyOn(mockProfileService, "getProfile").mockRejectedValue(new Error("Database Error"));
      try {
        await controller.getProfile();
      } catch (error) {
        expect(error.message).toEqual("Database Error");
      }
    })
  })

  describe("updateProfile", () => {
    it("Should be failed update profile because profile not found", async () => {
      // Arrange
      const payload = {} as ProfileDto;
      jest.spyOn(mockProfileService, "updateProfile").mockRejectedValue(new Error("Profile not found"));

      // Act
      try {
        await controller.updateProfile(payload);
      } catch (error) {
        // Assert
        expect(error.message).toEqual("Profile not found");
      }
    })

    it("Should be success update profile", async () => {
      // Arrange
      const profileBeforeUpdate = {
        name: "test212"
      }
      const payload = {
        name: "test",
      } as ProfileDto;

      jest.spyOn(mockProfileService, "getProfile").mockResolvedValue(profileBeforeUpdate as any);
      jest.spyOn(mockProfileService, "updateProfile").mockResolvedValue(payload);

      // Act
      const result = await controller.updateProfile(payload);

      // Assert
      expect(result.data.name).toEqual(payload.name);
      expect(result.data.name).not.toEqual(profileBeforeUpdate.name);
    })
  });

  describe("deleteProfile", () => {
    it("Should be failed delete profile", async () => {
      // 
      const payload = {
        username: "test",
        password: "test"
      } as DeleteAccountDto;
      jest.spyOn(mockProfileService, "getProfile").mockRejectedValue(new Error("Profile not found"));

      // Act
      try {
        await controller.deleteProfile(payload);
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("Profile not found"));
      }
    })

    it("Should be failed delete profile because invalid username", async () => {
      // Arrange
      const profile = {
        username: "test",
      } as UserDocument;
      const payload = {
        username: "test12",
        password: "test"
      } as DeleteAccountDto;
      jest.spyOn(mockProfileService, "getProfile").mockResolvedValue(profile);
      jest.spyOn(mockProfileService, "deleteProfile").mockRejectedValue(new Error("Wrong username"));

      // Act
      try {
        await controller.deleteProfile(payload);
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("Wrong username"));
      }
    })


    it("Should be failed delete profile because invalid password", async () => {
      // Arrange
      const profile = {} as UserDocument;
      const payload = {} as DeleteAccountDto;
      jest.spyOn(mockProfileService, "getProfile").mockResolvedValue(profile);
      jest.spyOn(mockProfileService, "deleteProfile").mockRejectedValue(new Error("Wrong password"));
      // Act
      try {
        await controller.deleteProfile(payload);
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("Wrong password"));
      }
    })

    it("Should be success delete profile", async () => {
      // Arrange
      const payload = {
        username: "test",
        password: "test"
      } as DeleteAccountDto;
      jest.spyOn(mockProfileService, "getProfile").mockResolvedValue(payload as any);
      jest.spyOn(mockProfileService, "deleteProfile").mockImplementation(() => {
        return Promise.resolve();
      })
      // Act
      const result = await controller.deleteProfile(payload);

      // Assert
      expect(result).toEqual({
        data: null,
        message: "Delete profile successfully"
      })
    })
  });
});
