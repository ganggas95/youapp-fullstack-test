import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { TokenService } from '@/modules/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.replace('Bearer ', '') || null;
    if (!token) throw new UnauthorizedException();
    try {
      const user = await this.tokenService.verifyToken(token);
      request["currentUser"] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
