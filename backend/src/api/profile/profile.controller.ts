import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';

import { BaseController } from '@/core/controller';
import { ResponseDTO } from '@/core/dto';
import { AuthRequired } from '@/decorators/auth.decorator';

import {
    DeleteAccountDto,
    ProfileDto,
    ProfileResponseDto
} from './dto/profile.dto';
import { ProfileService } from './profile.service';

@ApiTags("Profile Endpoint")
@Controller('profile')
export class ProfileController extends BaseController {
    constructor(private readonly profileService: ProfileService) {
        super();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @AuthRequired()
    @Get("")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Get profile success',
    })
    @ApiOperation({
        summary: "Get Profile",
        tags: ["Get Profile"],
        description: "Get the profile of current user"
    })
    async getProfile(): Promise<ResponseDTO<ProfileResponseDto>> {
        try {
            const user = await this.profileService.getProfile();
            return this.response({
                data: new ProfileResponseDto(user),
                message: "Get profile successfully"
            })
        } catch (error) {
            this.errorResponse(error)
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @AuthRequired()
    @Post("")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Get profile success',
    })
    @ApiOperation({
        summary: "Update or Create Profile",
        tags: ["Update Profile", "Create Profile"],
        description: "Create or Update the profile of current user"
    })
    async updateProfile(
        @Body() profileDto: ProfileDto
    ): Promise<ResponseDTO<ProfileResponseDto>> {
        try {
            const user = await this.profileService.updateProfile(profileDto);
            return this.response({
                data: new ProfileResponseDto(user),
                message: "Update profile successfully"
            })
        } catch (error) {
            this.errorResponse(error)
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @AuthRequired()
    @Put("")
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.FORBIDDEN)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Delete account success',
    })

    @ApiForbiddenResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Delete account not allowed because username not match or the password is invalid',
    })
    @ApiOperation({
        summary: "Delete Account",
        tags: ["Delete Account"],
        description: "This endpoint will delete the account of current user"
    })
    async deleteProfile(
        @Body() deleteProfileDto: DeleteAccountDto
    ): Promise<ResponseDTO<null>> {
        try {
            await this.profileService.deleteProfile(deleteProfileDto);
            return this.response({
                data: null,
                message: "Delete profile successfully"
            })
        } catch (error) {
            this.errorResponse(error)
        }
    }

}
