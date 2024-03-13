import { Test, TestingModule } from '@nestjs/testing';

import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

describe('RegisterController', () => {
  let controller: RegisterController;

  const mockRegisterService = {
    registerNewUser: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [{
        provide: RegisterService,
        useValue: mockRegisterService
      }]
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe("register", () => {
    it("Should be success register", async () => {
      // Arrange
      const registerDto = {
        username: "test",
        email: "test",
        password: "test"
      }

      jest.spyOn(mockRegisterService, "registerNewUser").mockResolvedValue({
        username: registerDto.username,
        email: registerDto.email
      })

      // Act and Assertion
      expect(await controller.register(registerDto)).toEqual({
        data: {
          username: registerDto.username,
          email: registerDto.email
        },
        message: "User created successfully"
      })
    })

    it("Should be failed to register", async () => {
      // Arrange
      const registerDto = {
        username: "test",
        email: "test",
        password: "test"
      }

      jest.spyOn(mockRegisterService, "registerNewUser")
        .mockRejectedValue(new Error("User already exist"))

      // Act
      try {
        await controller.register(registerDto);
      } catch (error) {
        // Assert
        expect(error).toEqual(new Error("User already exist"))
      }
    })
  })

});
