import { IsNotEmpty } from "class-validator";
import { Employee } from "src/entities/employee.entity";
import { RoomStatus } from "src/entities/roomStatus.entity";
export class CreateRoomDto{
    @IsNotEmpty()
    code:string
    @IsNotEmpty()
    name:string
    @IsNotEmpty()
    machine_quantity:number

    @IsNotEmpty()
    employee_code:Employee
    @IsNotEmpty()
    status_id:RoomStatus
    
    

}