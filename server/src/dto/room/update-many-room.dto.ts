import { IsNotEmpty,IsOptional } from "class-validator";
export class UpdateManyRoomDto{
    @IsNotEmpty()
    code:string
    @IsOptional()
    name:string
    @IsOptional()
    machine_quantity:number
    @IsOptional()
    is_active:boolean;
}