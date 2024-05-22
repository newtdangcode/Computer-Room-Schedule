import { Module, forwardRef } from '@nestjs/common';
import { LecturerController } from './lecturer.controller';
import { LecturerService } from './lecturer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Lecturer } from 'src/entities/lecturer.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateLecturerDto } from 'src/dto/lecturer/create-lecturer.dto';
import { UpdateLecturerDto } from 'src/dto/lecturer/update-lecturer.dto';
import { UpdateManyEmployeeDto } from 'src/dto/employee/update-many-employee.dto';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account, Lecturer]),
    ConfigModule,
    CreateLecturerDto,
    UpdateLecturerDto,
    UpdateManyEmployeeDto,
    forwardRef(() => AuthModule),
  ],
  controllers: [LecturerController],
  providers: [LecturerService],
  exports: [LecturerService],
})
export class LecturerModule {}
