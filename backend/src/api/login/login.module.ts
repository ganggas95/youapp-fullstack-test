import { Module } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  providers: [LoginService, UserService],
  controllers: [LoginController]
})
export class LoginModule { }
