import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateManySemesterDto {
    @IsNotEmpty()
    id: number;
    @IsOptional()
    name: string;
    @IsOptional()
    start_time: Date;
    @IsOptional()
    end_time: Date;
    @IsOptional()
    is_active: boolean;
}