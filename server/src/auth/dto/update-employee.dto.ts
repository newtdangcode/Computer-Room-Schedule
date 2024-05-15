import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateEmployeeDto {
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
    
}