import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { BaseController } from '@/core/controller';
import { ResponseDTO } from '@/core/dto';

import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { LoginService } from './login.service';

@ApiTags("Login Endpoint")
@Controller('login')
export class LoginController extends BaseController {
    constructor(private readonly loginService: LoginService) {
        super();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post("")
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.UNAUTHORIZED)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: "Login user successfully",
    })
    @ApiUnauthorizedResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Login user failed",
    })
    @ApiOperation({
        summary: "Login to your account",
        tags: ["Login"],
        description: "Login to your account"
    })
    async login(
        @Body() loginDto: LoginDto
    ): Promise<ResponseDTO<LoginResponseDto>> {
        try {
            const data = await this.loginService.login(loginDto);
            return this.response({
                data,
                message: "Login user successfully"
            })
        } catch (error) {
            this.errorResponse(error);
        }
    }
}
