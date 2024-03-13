import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { MongoServerError } from 'mongodb';

import { BaseError } from '@/core/error';

import { CreateUserDto } from './dto/user.dto';
import { User } from './schemes/user.scheme';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUsers = [
    {
      _id: new Types.ObjectId(),
      username: 'testUser',
      email: 'testUser@email.com',
      password: 'testUser'
    },
    {
      _id: new Types.ObjectId(),
      username: 'excludedUsername',
      email: 'excludedUsername@email.com',
      password: 'excludedUsername'
    }
  ]

  const mockUserRepostory = {
    constructor: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn()
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: getModelToken(User.name),
        useValue: mockUserRepostory
      }],
    }).compile();

    service = module.get<UserService>(UserService);

  });

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should retrieve users excluding the specified username', async () => {
      // Arrange
      jest.spyOn(mockUserRepostory, 'find').mockResolvedValueOnce(
        mockUsers.filter(d => d.username !== 'excludedUsername'));

      // Act
      const users = await service.getUsers('excludedUsername');
      // Assert
      expect(users.find(d => d.username === 'excludedUsername')).toBeUndefined()
      expect(users.length).toEqual(1);
    });

    it('should retrieve all users when no username is specified to exclude', async () => {
      // Arrange
      jest.spyOn(mockUserRepostory, 'find').mockResolvedValueOnce(
        mockUsers);

      // Act
      const users = await service.getUsers();
      // Assert
      expect(users.length).toEqual(2);
    });
  });

  describe('findUserById', () => {
    it('should retrieve user by id', async () => {
      // Arrange
      const id = mockUsers[0]._id;
      jest.spyOn(mockUserRepostory, 'findOne').mockResolvedValueOnce(
        mockUsers[0]
      );

      // Act
      const user = await service.findUserById(id);
      // Assert
      expect(user).toEqual(mockUsers[0]);
    });
  })

  describe('findUserByUsername', () => {
    it('should retrieve user by username', async () => {
      // Arrange
      const username = mockUsers[0].username;
      jest.spyOn(mockUserRepostory, 'findOne').mockResolvedValueOnce(
        mockUsers[0]
      );

      // Act
      const user = await service.findUserByUsername(username);
      // Assert
      expect(user).toEqual(mockUsers[0]);
    });
  })

  describe('findUserByUsernameOrEmail', () => {
    it('should retrieve user by username or email', async () => {
      // Arrange
      const username = mockUsers[0].username;
      const email = mockUsers[0].email;
      jest.spyOn(mockUserRepostory, 'findOne').mockResolvedValueOnce(
        mockUsers[0]
      );

      // Act
      const user = await service.findUserByUsernameOrEmail(username, email);
      // Assert
      expect(user).toEqual(mockUsers[0]);
    });
  });


  describe('buildErrorConflictUser', () => {
    it('should throw a conflict error with username', () => {
      const error = new MongoServerError({ keyPattern: { username: 1 } });
      expect(() => service.buildErrorConflictUser(error)).toThrow(BaseError);
    });
  });


  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const username = "testuser";
      await service.deleteUser(username);
      expect(mockUserRepostory.deleteOne).toHaveBeenCalledWith({ username });
    })
  })

  describe("removeAllUsers", () => {
    it("should delete all user", async () => {
      await service.removeAllUsers();
      expect(mockUserRepostory.deleteMany).toHaveBeenCalled();
    })
  })

  describe('createUser', () => {
    beforeEach(() => {
      (service as any).userModel = jest.fn(() => ({
        constructor: jest.fn(),
        setPassword: jest.fn(),
        save: jest.fn().mockResolvedValue({
          _id: new Types.ObjectId(),
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password'
        })
      }))
    })
    afterEach(() => {
      jest.clearAllMocks();
    })
    it('should create a new user and return the user document', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password'
      };
      const result = await service.createUser(createUserDto);
      expect(result).toMatchObject(createUserDto);
    });

    it('should throw BaseError for conflicting username or email', async () => {
      const createUserDto: CreateUserDto = {
        username: 'conflictuser',
        email: 'conflictuser@example.com',
        password: 'password'
      };
      (service as any).userModel = jest.fn(() => ({
        constructor: jest.fn(),
        setPassword: jest.fn(),
        save: jest.fn().mockRejectedValue(
          new MongoServerError({ code: 11000, keyPattern: { username: 1 } }))
      }))
      try {
        await service.createUser(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseError);
      }
    });

    it('should throw database error', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password'
      };
      (service as any).userModel = jest.fn(() => ({
        constructor: jest.fn(),
        setPassword: jest.fn(),
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      }))
      try {
        await service.createUser(createUserDto);
      } catch (error) {
        expect(error.message).toBe('Database error');
      }
    });
  });

  describe('saveUser', () => {
    const _id = new Types.ObjectId()
    const payload = {
      _id,
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
    }
    const mockUser = {
      save: jest.fn().mockResolvedValue(payload)
    } as any;

    it('should save a user document successfully', async () => {
      const savedUser = await service.saveUser(mockUser);
      expect(savedUser).toEqual(payload);
    });

    it('should throw an error for conflict with username or email', async () => {
      mockUser.save.mockRejectedValue(
        new MongoServerError({ code: 11000, keyPattern: { username: 1 } }));
      await expect(service.saveUser(mockUser)).rejects.toThrow(BaseError);
    });

    it('should throw an error for database error', async () => {
      mockUser.save.mockRejectedValue(new Error('Database error'));
      await expect(service.saveUser(mockUser)).rejects.toThrow();
    });
  });

});
