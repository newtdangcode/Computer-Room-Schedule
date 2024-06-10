import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateRoomDto } from 'src/dto/room/create-room.dto';
import { UpdateRoomDto } from 'src/dto/room/update-room.dto';
import { UpdateManyRoomDto } from 'src/dto/room/update-many-room.dto';
import { Booking } from 'src/entities/booking.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([Room, Booking, Employee]),
        ConfigModule,
        CreateRoomDto,
        UpdateRoomDto,
        UpdateManyRoomDto
    ],
  controllers: [RoomController],

  providers: [RoomService],
  exports:[RoomService]
})
export class RoomModule {}