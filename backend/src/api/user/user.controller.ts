import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    UseInterceptors
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@/core/controller';
import { ResponseDTO } from '@/core/dto';
import { BaseError } from '@/core/error';
import { AuthenticatedRequest } from '@/core/request';
import { AuthRequired } from '@/decorators/auth.decorator';
import { toObjectId } from '@/utils/transformId.utils';

import { UserResponseDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags("User endpoint")
@Controller('user')
export class UserController extends BaseController {

    constructor(
        @Inject(REQUEST)
        private readonly request: AuthenticatedRequest,
        private readonly userService: UserService) {
        super();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/list')
    @AuthRequired()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: "Success get list of users"
    })
    @ApiOperation({
        summary: 'Get list of users',
        description: "Get list of users"
    })
    async getUsers(): Promise<ResponseDTO<UserResponseDto[]>> {
        try {
            const users = await this.userService.getUsers(
                this.request.currentUser.username
            );
            return this.response({
                data: users.map(user => new UserResponseDto(user)),
                message: 'Get users successfully'
            })
        } catch (error) {
            this.errorResponse(error);
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:userId/detail')
    @AuthRequired()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: "Success get list of users"
    })
    @ApiOperation({
        summary: 'Get list of users',
        description: "Get list of users"
    })
    async getDetailUser(
        @Param("userId")
        userId: string
    ): Promise<ResponseDTO<UserResponseDto>> {
        try {
            const user = await this.userService.findUserById(
                toObjectId(userId));
            if (!user) throw new BaseError(
                HttpStatus.NOT_FOUND,
                null,
                'User not found');
            return this.response({
                data: user ? new UserResponseDto(user) : null,
                message: 'Get detail user successfully'
            })
        } catch (error) {
            this.errorResponse(error);
        }
    }
}
