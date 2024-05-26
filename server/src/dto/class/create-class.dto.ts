import { IsNotEmpty } from "class-validator";

export class CreateClassDto {
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    lecturer_code: string;
}