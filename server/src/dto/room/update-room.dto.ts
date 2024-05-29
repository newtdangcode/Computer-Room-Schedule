import { IsOptional } from "class-validator";
export class UpdateRoomDto{
    @IsOptional()
    code:string
    @IsOptional()
    name:string
    @IsOptional()
    machine_quantity:number
    @IsOptional()
    is_active:boolean;
   

}