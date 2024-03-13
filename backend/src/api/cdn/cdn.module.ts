import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import crypto from 'crypto';
import { diskStorage } from 'multer';

import { CdnController } from './cdn.controller';
import { CdnService } from './cdn.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOAD_DIR'),
          filename: (req, file, cb) => {
            const suffix = crypto.randomBytes(12)
              .toString('hex');
            const extension = file.mimetype.split('/')[1];
            cb(null, `${file.fieldname}-${suffix}.${extension}`);
          },
        }),
      }),
      inject: [ConfigService],
    })],
  providers: [CdnService],
  controllers: [CdnController]
})
export class CdnModule { }
