import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {

    excludePaths = ["/api/profile", "/api/user/list"];

    isRequestCacheable(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        if (req instanceof Socket) return true;
        return (
            this.allowedMethods.includes(req.method) &&
            !this.excludePaths.includes(req.url)
        );
    }
}