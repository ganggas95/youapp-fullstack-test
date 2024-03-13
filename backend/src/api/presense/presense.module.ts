import { Module } from '@nestjs/common';

import { PresenseGateway } from './presense.gateway';

@Module({
  providers: [PresenseGateway],
  controllers: []
})
export class PresenseModule { }
