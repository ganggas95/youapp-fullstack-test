import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { BaseError } from '@/core/error';
import { AuthenticatedRequest } from '@/core/request';
import {
    detectChineseZodiac,
    detectZodiac
} from '@/utils/zodiac-horoscope.utils';

import {
    UserDocument,
    UserPasswordUtilType
} from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';
import { DeleteAccountDto, ProfileDto } from './dto/profile.dto';

@Injectable({
    scope: Scope.REQUEST,
})
export class ProfileService {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthenticatedRequest,
        private readonly userService: UserService,
    ) { }
    /**
    * Get the profile of the current user.
    *
    * @return {Promise<UserDocument & UserPasswordUtilType>} the user profile
    */
    async getProfile(): Promise<UserDocument & UserPasswordUtilType> {
        return await this.userService.findUserByUsername(
            this.request.currentUser.username);
    }
    /**
     * Updates the user profile with the provided profile data.
     *
     * @param {ProfileDto} profileDto - the profile data to update the user with
     * @return {Promise<UserDocument>} the updated user document
     */
    async updateProfile(profileDto: ProfileDto): Promise<UserDocument> {
        const user = await this.getProfile();
        if (!user) throw new BaseError(
            HttpStatus.NOT_FOUND,
            null,
            'Profile not found');
        user.name = profileDto.name || user.name;
        user.gender = profileDto.gender || user.gender;
        user.avatar = profileDto.avatar || user.avatar;
        user.birthday = profileDto.birthday || user.birthday;

        // Update horoscope and zodiac if birthday is provided
        if (profileDto.birthday) {
            user.horoscope = detectZodiac(profileDto.birthday);
            user.zodiac = detectChineseZodiac(profileDto.birthday);
        }
        user.interests = profileDto.interests || user.interests;
        user.weight = profileDto.weight || user.weight;
        user.height = profileDto.height || user.height;
        return await this.userService.saveUser(user)
    }

    /**
     * Delete a user profile.
     *
     * @param {DeleteAccountDto} deleteProfile - the profile to be deleted
     * @return {Promise<void>} a promise that resolves when the profile is successfully deleted
     */
    async deleteProfile(deleteProfile: DeleteAccountDto): Promise<void> {
        const user = await this.getProfile();
        // Check if the user exists
        if (!user) throw new BaseError(
            HttpStatus.NOT_FOUND,
            null,
            'Profile not found'
        )
        // Check if the username and password are correct
        if (user.username !== deleteProfile.username) {
            throw new BaseError(
                HttpStatus.FORBIDDEN,
                null,
                'Wrong username');
        }
        // Check if the password is correct
        const passwordIsValid = user.validatePassword(
            deleteProfile.password)
        if (!passwordIsValid) {
            throw new BaseError(
                HttpStatus.FORBIDDEN,
                null,
                'Wrong password');
        }

        // Delete the user
        await this.userService.deleteUser(user.username);
    }
}
