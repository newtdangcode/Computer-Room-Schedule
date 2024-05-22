import { IsOptional } from "class-validator";

export class UpdateSemesterDto {
    @IsOptional()
    name: string;
    @IsOptional()
    start_time: Date;
    @IsOptional()
    end_time: Date;
    @IsOptional()
    is_active: boolean;

}