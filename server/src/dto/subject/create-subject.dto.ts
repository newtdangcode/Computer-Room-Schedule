import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateSubjectDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
    lecturer_code: string;
    @IsNotEmpty()
    semester_id: number;
   
}