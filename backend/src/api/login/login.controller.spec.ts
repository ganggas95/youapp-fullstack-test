import { Test, TestingModule } from '@nestjs/testing';

import { LoginController } from './login.controller';
import { LoginService } from './login.service';

describe('LoginController', () => {
  let controller: LoginController;

  const mockLoginService = {
    login: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [{
        provide: LoginService,
        useValue: mockLoginService
      }]
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should be success login', async () => {
      // Arrange
      jest.spyOn(mockLoginService, 'login').mockResolvedValue({ token: 'token', username: 'test' });

      expect(await controller.login({ username: 'test', password: 'test' })).toEqual({
        data: {
          token: expect.any(String),
          username: 'test'
        },
        message: "Login user successfully"
      });
    });

    it('should be failed to login', async () => {
      // Arrange
      jest.spyOn(mockLoginService, 'login').mockRejectedValue(
        new Error('Username and Password wrong'));
      try {
        await controller.login({ username: 'test', password: 'test' })
      } catch (error) {
        expect(error).toEqual(new Error('Username and Password wrong'));
      }
    });
  })
});
