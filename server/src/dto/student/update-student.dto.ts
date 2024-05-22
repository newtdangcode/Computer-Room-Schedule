import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateStudentDto {
    @IsOptional()
    username: string;
    
    @IsOptional()
    password: string;
    
    @IsOptional()
    @IsEmail()
    email: string;
   
    @IsOptional()
    first_name: string;
   
    @IsOptional()
    last_name: string;
    
    @IsOptional()
    phone_number: string;

    @IsOptional()
    class_code: string;

    @IsOptional()
    is_active: boolean;
    
}