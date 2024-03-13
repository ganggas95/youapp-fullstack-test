import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemes/user.scheme';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule, UserService]
})
export class UserModule { }
