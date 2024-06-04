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
import { SemesterModule } from './semester/semester.module';
import { Semester } from './entities/semester.entity';
import { SubjectModule } from './subject/subject.module';
import { Subject } from './entities/subject.entity';
import { BookingStatus } from './entities/bookingStatus.entity';
import { Room } from './entities/room.entity';
import { RoomStatus } from './entities/roomStatus.entity';
import { RoomModule } from './room/room.module';
import { RoomStatusModule } from './roomStatus/roomStatus.module';
import { BookingModule } from './booking/booking.module';
import { Booking } from './entities/booking.entity';
import { Shift } from './entities/shift.entity';
import { ShiftModule } from './shift/shift.module';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './entities/notification.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username:'root',
      password:'',
      database:'computer-room-schedule',
      entities: [
        Role,
        Account,
        Class,
        Student,
        Lecturer,
        Employee,
        Semester,
        Subject,
        BookingStatus,
        Room,
        RoomStatus,
        Booking,
        Shift,
        Notification
      ],
      synchronize: false,

    }),
    ConfigModule,
    AuthModule,
    EmployeeModule,
    ClassModule,
    StudentModule,
    LecturerModule,
    SemesterModule,
    SubjectModule,
    RoomModule,
    RoomStatusModule,
    BookingModule,
    ShiftModule,
    NotificationModule

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
