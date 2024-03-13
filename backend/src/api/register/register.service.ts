import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
    constructor(
        private readonly userService: UserService
    ) { }

    /**
     * Register a new user.
     *
     * @param {RegisterDto} registerDto - the registration data
     * @return {User} the newly created user
     */
    registerNewUser(registerDto: RegisterDto) {
        return this.userService.createUser({
            username: registerDto.username,
            email: registerDto.email,
            password: registerDto.password
        });
    }
}
