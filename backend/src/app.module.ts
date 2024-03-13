import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { redisStore } from 'cache-manager-redis-yet';

import { CdnModule } from './api/cdn/cdn.module';
import { ChatModule } from './api/chat/chat.module';
import {
  Conversation,
  ConversationSchema
} from './api/chat/schemes/conversation.scheme';
import { Message, MessageSchema } from './api/chat/schemes/message.scheme';
import { LoginModule } from './api/login/login.module';
import { PresenseModule } from './api/presense/presense.module';
import { ProfileModule } from './api/profile/profile.module';
import { RegisterModule } from './api/register/register.module';
import { User, UserSchema } from './api/user/schemes/user.scheme';
import { UserModule } from './api/user/user.module';
import { UserService } from './api/user/user.service';
import { CustomCacheInterceptor } from './interceptors/cache.interceptor';
import { TokenModule } from './modules/token/token.module';

import type { RedisClientOptions } from 'redis';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          isGlobal: true,

          // host: configService.get<string>('REDIS_HOST'),
          // port: configService.get<number>('REDIS_PORT'),
          url: configService.get<string>('REDIS_URL'),
          store: redisStore,
          ttl: 1000 * 60,
        }
      },
      imports: [ConfigModule],
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return [{
          rootPath: configService.get<string>('UPLOAD_DIR'),
          serveRoot: "/cdn",
          serveStaticOptions: {
            index: false
          }
        }]
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_URI'),
          dbName: configService.get<string>('MONGO_DB_NAME')
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        verifyOptions: {
          algorithms: ['HS256'],
          maxAge: configService.get<string>('JWT_EXPIRES_IN')
        },
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN')
        }
      }),
      inject: [ConfigService],
      global: true,
    }),
    TokenModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
      isGlobal: true
    }),
    LoginModule,
    RegisterModule,
    UserModule,
    ChatModule,
    ProfileModule,
    PresenseModule,
    CdnModule,
  ],
  providers: [UserService, {
    provide: APP_INTERCEPTOR,
    useClass: CustomCacheInterceptor
  }],

  exports: [MongooseModule, UserService],
  // exports: [TypeOrmModule, UserService],
})
export class AppModule { }
