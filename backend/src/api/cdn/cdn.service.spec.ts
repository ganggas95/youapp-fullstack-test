import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { CdnService } from './cdn.service';

describe('CdnService', () => {
  let service: CdnService;
  const mockConfigService = {
    get: jest.fn(() => 'http://yourapp.com'),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdnService, {
        provide: ConfigService,
        useValue: mockConfigService
      }],
    }).compile();

    service = module.get<CdnService>(CdnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate CDN url for valid filename', () => {
    const filename = 'example.jpg';
    const expectedUrl = 'http://yourapp.com/cdn/example.jpg';
    const generatedUrl = service.generateCdnUrl(filename);
    expect(generatedUrl).toEqual(expectedUrl);
  });

  it('should return empty string for empty filename', () => {
    const filename = '';
    const generatedUrl = service.generateCdnUrl(filename);
    expect(generatedUrl).toEqual('http://yourapp.com/cdn/');
  });

  it('should handle special characters in filename', () => {
    const filename = 'a%b&c=d e';
    const expectedUrl = 'http://yourapp.com/cdn/a%b&c=d e';
    const generatedUrl = service.generateCdnUrl(filename);
    expect(generatedUrl).toEqual(expectedUrl);
  });
});
