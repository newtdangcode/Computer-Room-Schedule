import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateSemesterDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsDateString()
    start_time: Date;
    @IsNotEmpty()
    @IsDateString()
    end_time: Date;
}