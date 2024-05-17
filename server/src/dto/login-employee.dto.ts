import { IsNotEmpty } from "class-validator";

export class LoginEmployeeDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}