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
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';

import { BaseController } from '@/core/controller';
import { ResponseDTO } from '@/core/dto';

import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { RegisterService } from './register.service';

@ApiTags("Register Endpoint")
@Controller('register')
export class RegisterController extends BaseController {
    constructor(private readonly registerService: RegisterService) {
        super();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @HttpCode(HttpStatus.CONFLICT)
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        description: "Register new user successfully",
    })
    @ApiConflictResponse({
        status: HttpStatus.CONFLICT,
        description: "Register new user with existing username or email",
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Validation failed when field not match the rule",
    })
    @ApiOperation({
        summary: "Register new user",
        tags: ["Register User"],
        description: "Register new user"
    })
    async register(
        @Body() registerDto: RegisterDto
    ): Promise<ResponseDTO<RegisterResponseDto>> {
        try {
            const user = await this.registerService.registerNewUser(registerDto);
            return this.response({
                data: new RegisterResponseDto(user),
                message: "User created successfully"
            });
        } catch (error) {
            this.errorResponse(error)
        }
    }
}
