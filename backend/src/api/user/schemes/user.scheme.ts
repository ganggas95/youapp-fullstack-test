import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

export type UserPasswordUtilType = {
    setPassword(password: string): void
    validatePassword(password: string): boolean
}

@Schema()
export class User {
    @Prop({ nullable: false, unique: true })
    username: string;

    @Prop({ nullable: false })
    password: string;

    @Prop({ nullable: false, unique: true })
    email: string;

    @Prop({ nullable: true })
    name: string;

    @Prop({ nullable: true })
    gender: string;

    @Prop({ nullable: true })
    avatar: string;

    @Prop({ nullable: true })
    birthday: Date;

    @Prop({ nullable: true })
    zodiac?: string;

    @Prop({ nullable: true })
    horoscope?: string;

    @Prop({ nullable: true })
    height: number;

    @Prop({ nullable: true })
    weight: number;

    @Prop([String])
    interests: string[]

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date

    @Prop()
    salt: string
}

export type UserDocument = mongoose.HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.setPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        'sha512'
    ).toString('hex');
}

UserSchema.methods.validatePassword = function (password: string) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        'sha512'
    ).toString('hex');
    return this.password === hash;
}