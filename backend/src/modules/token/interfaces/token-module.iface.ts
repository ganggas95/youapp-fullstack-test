import { ModuleMetadata, Type } from '@nestjs/common';

export interface TokenOptions {
    secret: string;
}

export interface TokenModuleOptionsFactory {
    createTokenModuleOptions: () => Promise<TokenOptions> | TokenOptions;
}

export interface TokenModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    isGlobal: boolean;
    inject?: any[];
    useClass?: Type<TokenModuleOptionsFactory>;
    useExisting?: Type<TokenModuleOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<TokenOptions> | TokenOptions;
}
