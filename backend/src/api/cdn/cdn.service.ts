import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class CdnService {

  constructor(
    private readonly configService: ConfigService) { }

  public generateCdnUrl(filename: string): string {
    const appBaseUrl = this.configService.get("APP_BASE_URL");
    return appBaseUrl + `/cdn/${filename}`
  }
}
