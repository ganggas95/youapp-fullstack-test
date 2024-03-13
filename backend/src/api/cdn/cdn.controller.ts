import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@/core/controller';
import { AuthRequired } from '@/decorators/auth.decorator';
import { ApiUploadFile } from '@/decorators/upload.decorator';

import { CdnService } from './cdn.service';

@ApiTags("Cdn")
@Controller('cdn')
export class CdnController extends BaseController {

  constructor(private readonly cdnService: CdnService) {
    super();
  }
  @AuthRequired()
  @Post('upload')
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Upload a file. Supported file extensions: .jpg, .jpeg, .png',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiUploadFile("file")
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Return url with full path of uploaded file
    return this.response({
      data: this.cdnService.generateCdnUrl(file.filename),
      message: 'File uploaded successfully',
    })
  }
}
