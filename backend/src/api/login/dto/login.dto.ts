import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'username',
        description: 'Username for login',
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'password',
        description: 'Password for login',
    })
    @IsNotEmpty()
    password: string;
}


export class LoginResponseDto {
    @ApiProperty({
        example: 'username',
        description: 'Username for login',
    })
    username: string;

    @ApiProperty({
        example: "Token",
        description: 'Token for login',
    })
    token: string;

    constructor(username: string, token: string) {
        this.username = username;
        this.token = token;
    }
}