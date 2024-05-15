import { Module, forwardRef } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CreateEmployeeDto } from 'src/auth/dto/create-employee.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UpdateEmployeeDto } from 'src/auth/dto/update-employee.dto';
import { UpdateManyEmployeeDto } from 'src/auth/dto/update-many-employee.dto';
@Module({
  imports:[
    TypeOrmModule.forFeature([Account,Employee]),
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
