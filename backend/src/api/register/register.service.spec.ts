import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../user/user.service';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  const mockUserService = {
    findUserByUsernameOrEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterService, {
        provide: UserService,
        useValue: mockUserService
      }],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("registerNewUser", () => {
    it("Should be success register", async () => {
      // Arrange
      const registerDto = {
        username: "test",
        email: "test",
        password: "test"
      }
      jest.spyOn(mockUserService, "findUserByUsernameOrEmail").mockResolvedValue(null);
      jest.spyOn(mockUserService, "createUser").mockResolvedValue({
        username: registerDto.username,
        email: registerDto.email
      })

      // Act
      const result = await service.registerNewUser(registerDto);

      // Assert
      expect(result).toEqual({
        username: registerDto.username,
        email: registerDto.email
      })
    })

    it("Should be failed to register because user already exist", async () => {
      // Arrange
      const registerDto = {
        username: "test",
        email: "test",
        password: "test"
      }
      jest.spyOn(mockUserService, "findUserByUsernameOrEmail").mockResolvedValue(
        { username: registerDto.username, email: registerDto.email });
      jest.spyOn(mockUserService, "createUser").mockRejectedValue(new Error("User already exist"))
      // Act
      try {
        await service.registerNewUser(registerDto)
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("User already exist"))
      }

      // Assert
    })
  })
});
