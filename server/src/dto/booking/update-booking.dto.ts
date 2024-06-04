import { IsOptional } from "class-validator";

export class UpdateBookingDto {
    @IsOptional()
    room_code: string;
    @IsOptional()
    date: Date;
    @IsOptional()
    shift_id: number;
    @IsOptional()
    lecturer_code: string;
    @IsOptional()
    subject_id: number;
    @IsOptional()
    status_id: number;
    @IsOptional()
    semester_id: number;
    @IsOptional()
    employee_code: string;
    @IsOptional()
    is_active: boolean;
}