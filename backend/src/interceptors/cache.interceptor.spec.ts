import { ExecutionContext } from '@nestjs/common';

import { Namespace, Server, Socket } from 'socket.io';

import { CustomCacheInterceptor } from './cache.interceptor';

describe('CustomCacheInterceptor', () => {
    let cacheInterceptor: CustomCacheInterceptor;
    beforeAll((done) => {
        cacheInterceptor = new CustomCacheInterceptor({}, {} as any);

        done();
    });

    it('should return true if request is an instance of Socket', () => {

        const context: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => new Socket(new Namespace(new Server(), "/"), {
                    conn: {
                        remoteAddress: "127.0.0.1"
                    }
                } as any, {}, {
                    rooms: [],
                    missedPackets: []
                } as any) as any,
            }),
        } as ExecutionContext;
        expect(cacheInterceptor.isRequestCacheable(context)).toBe(true);
    });

    it('should return true if request method is included in allowedMethods', () => {
        const context: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'GET',
                }),
            }),
        } as ExecutionContext;
        expect(cacheInterceptor.isRequestCacheable(context)).toBe(true);
    });

    it('should return true if request url is not included in excludePaths', () => {
        cacheInterceptor.excludePaths = ['/exclude'];
        const context: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'GET',
                    url: '/test',
                }),
            }),
        } as ExecutionContext;
        expect(cacheInterceptor.isRequestCacheable(context)).toBe(true);
    });
});