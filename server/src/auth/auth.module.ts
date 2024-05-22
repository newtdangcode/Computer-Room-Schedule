import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmployeeService } from 'src/employee/employee.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { StudentModule } from 'src/student/student.module';
import { Student } from 'src/entities/student.entity';
import { Lecturer } from 'src/entities/lecturer.entity';
import { LecturerModule } from 'src/lecturer/lecturer.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account,Employee,Lecturer,Student]),
    JwtModule.register({
      global: true,
      secret:'123456',
      signOptions:{expiresIn:'1h'}
    }),
    ConfigModule,
    forwardRef(() => EmployeeModule),
    forwardRef(() => StudentModule),
    forwardRef(() => LecturerModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
