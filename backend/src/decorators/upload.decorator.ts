import {
  applyDecorators,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiUploadFile(fieldName: string) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    UsePipes(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 2,
          message: "File size should be less than 2MB",
        }),
      ]
    }))
  );
}
