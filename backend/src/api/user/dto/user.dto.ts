import { ApiProperty } from '@nestjs/swagger';

import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    Matches
} from 'class-validator';

import { shallow } from '@/utils/shallow.utils';

import { User } from '../schemes/user.scheme';

export class CreateUserDto {

    @ApiProperty({
        example: 'username',
        description: 'Username of the user',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9]+$/, {
        message: 'Username must only contain alphanumeric characters without spaces.',
    })
    username: string;

    @ApiProperty({
        example: 'email@email.com',
        description: 'Email address of the user',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password',
        description: 'Password of the user',
    })
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1,
    })
    password: string;
}

export class UserResponseDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({
        example: 'username',
        description: 'Username of the user',
    })
    username: string;

    @ApiProperty({
        example: 'email@email.com',
        description: 'Email address of the user',
    })
    email: string;

    constructor(user: User) {
        Object.assign(
            this,
            shallow({
                source: user,
                fields: [
                    "id",
                    "username",
                    "email",
                    "avatar",
                    "name"
                ],
                fieldsReplace: { "_id": "id" }
            }));

    }
}