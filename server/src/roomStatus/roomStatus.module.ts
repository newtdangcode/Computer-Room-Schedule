import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomStatus } from "src/entities/roomStatus.entity";
import { RoomStatusService } from "./roomStatus.service";
import { RoomController } from "src/room/room.controller";
import { RoomStatusController } from "./roomStatus.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([RoomStatus]),
        ConfigModule,
    ],
    providers:[RoomStatusService],
    controllers:[RoomStatusController],
    exports:[RoomStatusService]
})
export class RoomStatusModule{}