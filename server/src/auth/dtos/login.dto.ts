import { ApiProperty,  } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ default: "example@mail.ru" })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ default: "pass123" })
    @IsNotEmpty()
    @IsString()
    password: string
}