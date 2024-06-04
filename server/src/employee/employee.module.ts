import { Module, forwardRef } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CreateEmployeeDto } from 'src/dto/employee/create-employee.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UpdateEmployeeDto } from 'src/dto/employee/update-employee.dto';
import { UpdateManyEmployeeDto } from 'src/dto/employee/update-many-employee.dto';
import { Booking } from 'src/entities/booking.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Account,Employee,Booking]),
    ConfigModule,
    CreateEmployeeDto,
    UpdateEmployeeDto,
    UpdateManyEmployeeDto,
    forwardRef(() => AuthModule),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
  
})
export class EmployeeModule {}
