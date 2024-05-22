import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service';
import { Role } from './entities/role.entity';
import { Account } from './entities/account.entity';
import { Class } from './entities/class.entity';
import { Student } from './entities/student.entity';
import { Lecturer } from './entities/lecturer.entity';
import { Employee } from './entities/employee.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';
import { LecturerModule } from './lecturer/lecturer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username:'',
      password:'',
      database:'computer-room-schedule',
      entities: [
        Role,
        Account,
        Class,
        Student,
        Lecturer,
        Employee
      ],
      synchronize: false,

    }),
    ConfigModule,
    AuthModule,
    EmployeeModule,
    ClassModule,
    StudentModule,
    LecturerModule,

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
