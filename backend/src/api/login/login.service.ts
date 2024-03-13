import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BaseError } from '@/core/error';

import { User } from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@Injectable()
export class LoginService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }
    /**
     * Perform user login with the provided credentials.
     *
     * @param {LoginDto} loginDto - the login data transfer object
     * @return {Promise<LoginResponseDto>} a promise that resolves to the login response data transfer object
     */
    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        // Find user by username or email
        const user = await this.userService.findUserByUsernameOrEmail(
            loginDto.username,
            loginDto.username
        );

        // Check if user exists
        if (!user) {
            throw new BaseError(
                HttpStatus.UNAUTHORIZED,
                null,
                'Username and Password wrong'
            )
        }

        // Check if password is valid
        if (!user.validatePassword(loginDto.password)) {
            throw new BaseError(
                HttpStatus.UNAUTHORIZED,
                null,
                'Username and Password wrong'
            )
        }

        // Generate token
        const token = await this.generateToken(user);
        
        return new LoginResponseDto(user.username, token);
    }

    /**
       * Asynchronously generates a token for the given user.
       *
       * @param {User} user - the user for which the token is generated
       * @return {Promise<string>} the generated token
       */
    async generateToken(user: User): Promise<string> {
        const payload = {
            username: user.username,
            email: user.email,
        }
        return this.jwtService.signAsync(payload);
    }
}
