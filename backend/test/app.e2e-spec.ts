import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { UserDocument } from '@/api/user/schemes/user.scheme';
import { UserService } from '@/api/user/user.service';
import { customValidationPipe } from '@/pipe/validator.pipe';

import { useContainer } from 'class-validator';
import { readdirSync, unlinkSync } from 'fs';
import path from 'path';
import requestTest, { Agent as TestSuperAgent } from 'supertest';

import { AppModule } from '../src/app.module';

describe('Application Integration Test (e2e)', () => {
  let app: INestApplication;
  let httpServer;
  let request: TestSuperAgent;
  let userService: UserService;
  let jwtService: JwtService;
  const mockUserDetail = {
    username: "userdetail",
    email: "userdetail@email.com",
    password: "userdetail"
  }

  let mockUserDetailDoc: UserDocument;
  const mockUsers = [
    {
      username: 'test',
      email: 'test@email.com',
      password: 'test'
    },
    {
      username: 'test1',
      email: 'test1@email.com',
      password: 'test1'
    },
    {
      username: 'test2',
      email: 'test2@email.com',
      password: 'test2'
    },
    {
      username: 'test3',
      email: 'test3@email.com',
      password: 'test3'
    },
  ]
  const createUserMock = async () => {
    mockUsers.forEach(async (user) => {
      await userService.createUser(user)
    })

    mockUserDetailDoc = await userService.createUser(mockUserDetail)
  }

  const generateAccessToken = (username?: string, email?: string) => {
    return jwtService.sign({ username: username || "test", email: email || "test@IsEmail.com" })
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api")

    app.useGlobalPipes(customValidationPipe);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    httpServer = app.getHttpServer();
    request = requestTest(httpServer);

    userService = app.get<UserService>(UserService);
    jwtService = app.get<JwtService>(JwtService);

    // await userService.removeAllUsers();
    await createUserMock();
    await app.init();

  })


  afterAll(async () => {
    await userService.removeAllUsers();
    await app.close();
    // Remove all files from the cdn folder
    const files = await readdirSync(path.resolve(__dirname, './upload-test'));
    for (const file of files) {
      await unlinkSync(path.resolve(__dirname, './upload-test', file));
    }
  })
  describe("LoginController (e2e)", () => {

    it('login 401 when username or password is wrong', (done) => {
      request
        .post('/api/login')
        .send({ username: 'test21', password: 'test' })
        .expect(HttpStatus.UNAUTHORIZED)
        .end((err, { body: { data, message } }) => {
          expect(data).toBeNull();
          expect(message).toBe('Username and Password wrong');
          done();
        })
    })

    it('login 400 when username or password is not provided', (done) => {
      request
        .post('/api/login')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .end((err, { body: { data, message } }) => {
          expect(data.username).not.toBeNull();
          expect(data.password).not.toBeNull();
          expect(message).toBe('Validation failed');
          done();
        })
    })

    it('login successfully when username or password is valid', (done) => {
      request
        .post('/api/login')
        .send({ username: 'test', password: 'test' })
        .expect(HttpStatus.OK)
        .end((err, { body: { data, message } }) => {
          expect(data.token).not.toBeNull();
          expect(message).toBe("Login user successfully");
          done();
        })
    })
  })

  describe("RegisterController (e2e)", () => {

    it('register with status 409 when username or email is exist', async () => {

      return request
        .post('/api/register')
        .send({
          username: 'test',
          email: 'test@email.com',
          password: 'P4$$wordStrong'
        })
        .expect(HttpStatus.CONFLICT)
        .then((response) => {
          const { data, message } = response.body
          expect(data.username).toBe("Username already exists");
          expect(message).toBe("User already exists");
          // done();
        })
    })

    it('register with status 404 with invalid email', () => {
      const payload = {
        username: 'testregister1223',
        password: 'P4$$wordStrong',
        email: 'testregister2email.com'
      }
      return request
        .post('/api/register')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const { data, message } = response.body;
          expect(data.email).not.toBeNull()
          expect(message).toBe("Validation failed");
        })
    });


    it('register with status 404 with invalid username', () => {
      const payload = {
        username: 'test register',
        password: 'P4$$wordStrong',
        email: 'testregister@email.com'
      }
      return request
        .post('/api/register')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const { data, message } = response.body;
          expect(data.username).not.toBeNull()
          expect(message).toBe("Validation failed");
        })
    });


    it('register with status 404 with not string password', () => {
      const payload = {
        username: 'testsregister',
        password: 'passwordnotstrong',
        email: 'testregisters@email.com'
      }
      return request
        .post('/api/register')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const { data, message } = response.body;
          expect(data.password).not.toBeNull()
          expect(message).toBe("Validation failed");
        })
    });

    it('register successfully with username and email valid', () => {
      const payload = {
        username: 'testregister2',
        password: 'P4$$wordStrong',
        email: 'testregister2@email.com'
      }
      return request
        .post('/api/register')
        .send(payload)
        .expect(HttpStatus.CREATED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data.username).toBe(payload.username);
          expect(data.email).toBe(payload.email);
          expect(message).toBe("User created successfully");
        })
    })
  })

  describe("CdnController (e2e)", () => {

    it('Upload with status 401 when token not provided', () => {
      return request
        .post('/api/cdn/upload')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("Unauthorized");
        })
    })

    it('Upload with status 200 when file is uploaded', () => {
      return request
        .post('/api/cdn/upload')
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .attach('file', path.resolve(__dirname, './file/test.jpeg'))
        .expect(HttpStatus.CREATED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).not.toBeNull();
          expect(message).toBe('File uploaded successfully');
        })
    })

    it('Upload with status 400 when file is to large', () => {
      return request
        .post('/api/cdn/upload')
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .attach('file', path.resolve(__dirname, './file/big-image.png'))
        .expect(HttpStatus.BAD_REQUEST)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("File size should be less than 2MB");
        })
    })
    it('Upload with status 400 when file extension is not supported', () => {
      return request
        .post('/api/cdn/upload')
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .attach('file', path.resolve(__dirname, './file/not-support-extension.svg'))
        .expect(HttpStatus.BAD_REQUEST)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("Validation failed (expected type is .(png|jpeg|jpg))");
        })
    })
  })

  describe("ProfileController (e2e)", () => {
    it("getProfile with status 401 when token not provided", () => {
      return request
        .get('/api/profile')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("Unauthorized");
        })
    })

    it("getProfile with status 200 when token is valid", () => {
      return request
        .get('/api/profile')
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .expect(HttpStatus.OK)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).not.toBeNull();
          expect(message).toBe("Get profile successfully");
        })
    })

    it("updateProfile with status 401 when token not provided", () => {
      return request
        .post('/api/profile')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("Unauthorized");
        })
    })

    it("updateProfile with status 200 when token is valid", () => {
      return request
        .post('/api/profile')
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .send({ name: 'test user' })
        .expect(HttpStatus.OK)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).not.toBeNull();
          expect(message).toBe("Update profile successfully");
        })
    })

    it("deleteProfile with status 401 when token not provided", () => {
      return request
        .put('/api/profile')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("Unauthorized");
        })
    })

    it("deleteProfile with status 200 when token is valid", () => {
      return request
        .put('/api/profile')
        .set('Authorization', `Bearer ${generateAccessToken("test2", "test2@email.com")}`)
        .send({ username: 'test2', password: 'test2' })
        .expect(HttpStatus.OK)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeNull();
          expect(message).toBe("Delete profile successfully");
        })
    })
  })

  describe("UserController (e2e)", () => {
    it("getUsers with status 401 when token not provided", () => {
      return request
        .get('/api/user/list')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("Unauthorized");
        })
    })

    it("getUsers with status 200 when token is valid", () => {
      return request
        .get('/api/user/list')
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .expect(HttpStatus.OK)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).not.toBeNull();
          expect(message).toBe("Get users successfully");
        })
    })

    it("getDetailUser with status 401 when token not provided", () => {
      return request
        .get(`/api/user/${mockUserDetailDoc._id.toString()}/detail`)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeUndefined();
          expect(message).toBe("Unauthorized");
        })
    })

    it("getDetailUser with status 200 when token provided", () => {
      return request
        .get(`/api/user/${mockUserDetailDoc._id.toString()}/detail`)
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .expect(HttpStatus.OK)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data.email).toEqual(mockUserDetailDoc.email);
          expect(data.username).toEqual(mockUserDetailDoc.username);
          expect(message).toBe("Get detail user successfully");
        })
    })

    it("getDetailUser with status 404 when user not found", () => {
      const userIdTemp = new Types.ObjectId();
      return request
        .get(`/api/user/${userIdTemp.toString()}/detail`)
        .set('Authorization', `Bearer ${generateAccessToken()}`)
        .expect(HttpStatus.NOT_FOUND)
        .then(async (response) => {
          const { data, message } = response.body;
          expect(data).toBeNull();
          expect(message).toBe("User not found");
        })
    })

  })


});
