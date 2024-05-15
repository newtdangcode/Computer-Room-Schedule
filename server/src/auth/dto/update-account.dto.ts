import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateAccountDto {
    @IsOptional()
    username: string;
    
    @IsOptional()
    password: string;
    
    @IsOptional()
    @IsEmail()
    email: string;

    
    
}