import { IsOptional } from "class-validator";

export class UpdateSubjectDto {
    @IsOptional()
    name: string;
    @IsOptional()
    code: string;
    @IsOptional()
    lecturer_code: string;
    @IsOptional()
    semester_id: number;
    @IsOptional()
    is_active: boolean;

}