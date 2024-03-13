import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from '@/api/user/dto/user.dto';
import { User } from '@/api/user/schemes/user.scheme';

export class RegisterDto extends CreateUserDto { }

export class RegisterResponseDto {
    @ApiProperty({
        description: 'Username of user',
    })
    username: string;

    @ApiProperty({
        description: 'Email of user',
    })
    email: string;

    constructor(user: User) {
        this.username = user.username;
        this.email = user.email
    }
}
