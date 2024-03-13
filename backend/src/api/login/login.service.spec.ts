import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  const mockUserService = {
    findUserByUsernameOrEmail: jest.fn(),
    validatePassword: jest.fn(),
  };
  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue("token")
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService, {
        provide: UserService,
        useValue: mockUserService
      }, {
          provide: JwtService,
          useValue: mockJwtService
        }],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it("Should be success login", async () => {
      // Arrange
      const loginDto = {
        username: "test",
        password: "test"
      }
      jest.spyOn(mockUserService, "findUserByUsernameOrEmail").mockResolvedValue({
        username: loginDto.username,
        validatePassword: jest.fn().mockResolvedValue(true)
      })
      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        token: expect.any(String),
        username: loginDto.username
      })
    })


    it("Should be failed login when user is null", async () => {
      // Arrange
      const loginDto = {
        username: "test",
        password: "test"
      }
      jest.spyOn(mockUserService, "findUserByUsernameOrEmail").mockResolvedValue(null);
      // Act
      try {
        await service.login(loginDto);
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("Username and Password wrong"));
      }
    })

    it("Should be failed login when password is invalid", async () => {
      // Arrange
      const loginDto = {
        username: "test",
        password: "test"
      }
      jest.spyOn(mockUserService, "findUserByUsernameOrEmail").mockResolvedValue({
        username: loginDto.username,
        validatePassword: jest.fn().mockReturnValue(false)
      })
      // Act
      try {
        await service.login(loginDto);
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("Username and Password wrong"));
      }
    })
  });

  describe('generateToken', () => {
    it('should generate token for a user with a username and email', async () => {
      const user = { username: 'testuser', email: 'testuser@example.com' } as User;
      const token = await service.generateToken(user);
      expect(token).toBeDefined();
    });
  })
});
