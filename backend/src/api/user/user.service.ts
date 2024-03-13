import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { MongoServerError } from 'mongodb';

import { BaseError } from '@/core/error';
import { ObjectId } from '@/interfaces/mongo.iface';

import { CreateUserDto } from './dto/user.dto';
import {
    User,
    UserDocument,
    UserPasswordUtilType
} from './schemes/user.scheme';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User & UserPasswordUtilType>
    ) { }

    /**
     * Retrieves users excluding the specified username.
     *
     * @param {string} except - the username to exclude
     * @return {Promise<(UserDocument & UserPasswordUtilType)[]>} array of users
     */
    async getUsers(
        except: string = null
    ): Promise<(UserDocument & UserPasswordUtilType)[]> {
        return await this.userModel.find({
            username: {
                $ne: except
            }
        })
    }
    /**
     * Finds a user by their ID.
     *
     * @param {ObjectId | string} userId - The ID of the user to find.
     * @return {Promise<UserDocument & UserPasswordUtilType>} A promise that resolves to the user document and password util type.
     */
    async findUserById(
        userId: ObjectId | string
    ): Promise<UserDocument & UserPasswordUtilType> {
        return await this.userModel.findOne({
            _id: {
                $eq: userId
            }
        });
    }

    /**
     * Find a user by username.
     *
     * @param {string} username - The username to search for
     * @return {Promise<UserDocument & UserPasswordUtilType>} The user document with password utility type
     */
    async findUserByUsername(
        username: string
    ): Promise<UserDocument & UserPasswordUtilType> {
        return await this.userModel.findOne({
            username: {
                $eq: username
            }
        });
    }
    /**
     * Finds a user by username or email.
     *
     * @param {string} username - The username to search for.
     * @param {string} email - The email to search for.
     * @return {Promise<UserDocument & UserPasswordUtilType | null>} The found user or null if not found.
     */
    async findUserByUsernameOrEmail(
        username: string,
        email: string
    ): Promise<UserDocument & UserPasswordUtilType | null> {
        return this.userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });
    }

    /**
     * Builds an error response for a conflict in user creation
     * @param error - The MongoDB error with keyPattern
     * @throws {BaseError} Conflict error with username and/or email if applicable
     * @returns Nothing, throws an error
     */
    buildErrorConflictUser(error: MongoServerError): never {
        const errorPayload: Record<'username' | 'email', string | undefined> = {
            username: error.keyPattern.username ? "Username already exists" : undefined,
            email: error.keyPattern.email ? "Email already exists" : undefined
        };
        const payload = Object.fromEntries(
            Object.entries(errorPayload).filter(([, value]) => !!value));
        throw new BaseError(
            HttpStatus.CONFLICT,
            payload,
            'User already exists');
    }

    /**
     * Create a new user in the database.
     * 
     * @param createUserDto The data for creating a new user.
     * @returns A Promise that resolves to the created user document.
     * @throws {BaseError} If there is a conflict with the username or email, or if there is an error with the database.
     */
    async createUser(createUserDto: CreateUserDto): Promise<UserDocument & UserPasswordUtilType> {
        try {
            const newUser: UserDocument & UserPasswordUtilType = new this.userModel(createUserDto);
            newUser.setPassword(createUserDto.password);
            return await newUser.save();
        } catch (error: any) {
            if (error.code === 11000) {
                this.buildErrorConflictUser(error);
            }
            throw error;
        }
    }

    /**
     * Saves a user document to the database.
     * 
     * @param user The user document to save.
     * @returns A Promise that resolves to the saved user document.
     * @throws {BaseError} If there is a conflict with the username or email, 
     *  or if there is an error with the database.
     */
    async saveUser(user: UserDocument & UserPasswordUtilType): Promise<UserDocument> {
        try {
            return await user.save();
        } catch (error: any) {
            if (error.code === 11000) {
                this.buildErrorConflictUser(error);
            }
            throw error;
        }
    }
    /**
     * Delete a user document from the database.
     * 
     * @param username The username of the user to delete.
     * @returns A Promise that resolves when the user is deleted.
     * @throws {Error} If there is an error with the database.
     */
    async deleteUser(username: string): Promise<void> {
        await this.userModel.deleteOne({ username });
    }

    /**
     * Remove all users from the database.
     *
     * @return {Promise<void>} Promise that resolves when all users are removed
     */
    async removeAllUsers(): Promise<void> {
        // Warning this will remove all users
        // This function should only be used for testing
        await this.userModel.deleteMany({});
    }
}
