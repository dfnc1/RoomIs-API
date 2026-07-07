import {IsEmail, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";
import {Exclude, Transform} from "class-transformer";
import {PartialType, PickType} from "@nestjs/mapped-types";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}

export class LoginDto extends PickType(RegisterDto, ['email', 'password'] as const) {
}

export class UpdateUserDto extends PartialType(RegisterDto) {
}

export class AuthResponseDto {
    token_type: "Bearer";
    access_token: string;
}

export class UserResponseDto {
    id: string
    name: string
    email: string
    role: string

    @Transform(({value}) => value?.toISOString())
    createdAt: Date;

    @Transform(({value}) => value?.toISOString())
    updatedAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial)
    }
}