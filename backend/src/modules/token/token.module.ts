import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { TOKEN_OPTIONS } from './constants/token.constants';
import {
  TokenModuleAsyncOptions,
  TokenModuleOptionsFactory
} from './interfaces/token-module.iface';
import { TokenService } from './token.service';

@Global()
@Module({
  providers: [],
  exports: []
})
export class TokenModule {
  static forRootAsync(options: TokenModuleAsyncOptions): DynamicModule {
    const providers = this.createAsyncProviders(options);
    return {
      global: options.isGlobal,
      module: TokenModule,
      providers: [...providers, TokenService],
      exports: [TokenService],
    };
  }

  private static createAsyncProviders(
    options: TokenModuleAsyncOptions,
  ): Provider[] {
    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];
    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(
    options: TokenModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        name: TOKEN_OPTIONS,
        provide: TOKEN_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      name: TOKEN_OPTIONS,
      provide: TOKEN_OPTIONS,
      useFactory: async (optionsFactory: TokenModuleOptionsFactory) => {
        return optionsFactory.createTokenModuleOptions();
      },
      inject: [options.useExisting! || options.useClass!],
    };
  }

}
