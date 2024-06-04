import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateBookingtDto {
    @IsNotEmpty()
    room_code: string;
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    shift_id: number;
    @IsNotEmpty()
    lecturer_code: string;
    @IsNotEmpty()
    subject_id: number;
    @IsNotEmpty()
    status_id: number;
    @IsNotEmpty()
    semester_id: number;
   
  

}