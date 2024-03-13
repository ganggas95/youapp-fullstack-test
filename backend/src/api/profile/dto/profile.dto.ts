import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNumber,
    IsOptional,
    IsUrl,
    Min
} from 'class-validator';
import dayjs from 'dayjs';

import { UserResponseDto } from '@/api/user/dto/user.dto';
import { User } from '@/api/user/schemes/user.scheme';

export class ProfileDto {
    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String, enum: ['male', 'female'] })
    @IsOptional()
    gender: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsUrl({
        protocols: ["http", "https"],
        require_tld: false,
    }, { message: 'avatar must be a valid url' })
    avatar: string;

    @ApiProperty({ type: Date })
    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : null)
    @IsDate()
    birthday: Date;

    @ApiProperty({ type: Number })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'height must be a positive number' })
    height: number;

    @ApiProperty({ type: Number })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'height must be a positive number' })
    weight: number;

    @ApiProperty({ type: Array<string> })
    @IsOptional()
    @IsArray()
    interests: string[];
}


export class DeleteAccountDto {
    @ApiProperty({
        type: String,
        required: true,
        description: "You must type the username to make sure your action"
    })
    username: string;
    @ApiProperty({
        type: String,
        required: true,
        description: "You must type the password to make sure your action"
    })
    password: string;
}


export class ProfileResponseDto extends UserResponseDto {

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String, enum: ['male', 'female'] })
    gender: string;

    @ApiProperty({ type: String })
    avatar: string;

    @ApiProperty({ type: Date })
    @Transform(({ value }) => value ? dayjs(value).format('YYYY-MM-DD') : null)
    birthday: Date;

    @ApiProperty({ type: Date })
    zodiac: string;

    @ApiProperty({ type: Date })
    horoscope: string;

    @ApiProperty({ type: Number })
    height: number;

    @ApiProperty({ type: Number })
    weight: number;

    @ApiProperty({ type: Array<string> })
    interests: string[];

    constructor(profile: User) {
        super(profile);
        this.name = profile?.name;
        this.gender = profile?.gender;
        this.avatar = profile?.avatar;
        this.birthday = profile?.birthday;
        this.zodiac = profile?.zodiac;
        this.horoscope = profile?.horoscope;
        this.height = profile?.height;
        this.weight = profile?.weight;
        this.interests = profile?.interests;
    }
}