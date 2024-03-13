import { Module } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [UserService, ProfileService]
})
export class ProfileModule { }
