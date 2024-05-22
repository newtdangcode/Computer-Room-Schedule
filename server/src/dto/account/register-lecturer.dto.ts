import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterLecturerDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    role_id: number;
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
    first_name: string;
    @IsNotEmpty()
    last_name: string;
    @IsNotEmpty()
    phone_number: string;
}