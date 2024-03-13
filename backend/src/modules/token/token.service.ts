import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserDocument } from '@/api/user/schemes/user.scheme';
import { UserService } from '@/api/user/user.service';

import { TOKEN_OPTIONS } from './constants/token.constants';
import { TokenOptions } from './interfaces/token-module.iface';

@Injectable()
export class TokenService {

    constructor(
        @Inject(JwtService)
        private readonly jwtService: JwtService,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(TOKEN_OPTIONS) private readonly tokenOptions: TokenOptions,
    ) { }
    /**
    * Verify the token and return the user document associated with the token.
    *
    * @param {string} token - the token to be verified
    * @return {Promise<UserDocument>} the user document associated with the token
    */
    async verifyToken(token: string): Promise<UserDocument> {
        if (!token) throw new UnauthorizedException();
        try {
            const secret = this.tokenOptions.secret;
            const decoded = await this.jwtService.verifyAsync(
                token, { secret });
            const user = await this.userService.findUserByUsernameOrEmail(
                decoded.username,
                decoded.email);
            if (!user) throw new UnauthorizedException();
            return user
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}