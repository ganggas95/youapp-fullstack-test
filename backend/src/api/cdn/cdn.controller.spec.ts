import { Test, TestingModule } from '@nestjs/testing';

import { TokenService } from '@/modules/token/token.service';

import { CdnController } from './cdn.controller';
import { CdnService } from './cdn.service';

describe('UploadController', () => {
  let controller: CdnController;
  const cdnServiceMock = {
    generateCdnUrl: jest.fn()
  }
  const tokenServiceMock = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CdnController],
      providers: [{
        provide: TokenService,
        useValue: tokenServiceMock
      }, {
        provide: CdnService,
        useValue: cdnServiceMock
      }]
    }).compile();

    controller = module.get<CdnController>(CdnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the correct CDN URL for the uploaded file', async () => {
    const file = { filename: 'testfile.jpg' } as Express.Multer.File;
    const cdnUrl = 'https://yourcdn.com/testfile.jpg';
    jest.spyOn(cdnServiceMock, 'generateCdnUrl').mockReturnValue(cdnUrl);

    const result = await controller.uploadFile(file);
    expect(result).toEqual({
      data: cdnUrl,
      message: 'File uploaded successfully',
    });
  });

  it('should return the correct success message after file upload', async () => {
    const file = { filename: 'testfile.jpg' } as Express.Multer.File;
    const cdnUrl = 'https://yourcdn.com/testfile.jpg';
    jest.spyOn(cdnServiceMock, 'generateCdnUrl').mockReturnValue(cdnUrl);

    const result = await controller.uploadFile(file);
    expect(result.message).toEqual('File uploaded successfully');
  });
});
