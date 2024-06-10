import { Module, forwardRef } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Room } from 'src/entities/room.entity';
import { Shift } from 'src/entities/shift.entity';
import { Lecturer } from 'src/entities/lecturer.entity';
import { Subject } from 'src/entities/subject.entity';
import { BookingStatus } from 'src/entities/bookingStatus.entity';
import { Semester } from 'src/entities/semester.entity';
import { Employee } from 'src/entities/employee.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateBookingtDto } from 'src/dto/booking/create-booking.dto';
import { UpdateBookingDto } from 'src/dto/booking/update-booking.dto';
import { UpdateManyBookingDto } from 'src/dto/booking/update-many-booking.dto';
import { SubjectModule } from 'src/subject/subject.module';
import { SemesterModule } from 'src/semester/semester.module';
import { ShiftModule } from 'src/shift/shift.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Room,
      Shift,
      Lecturer,
      Subject,
      BookingStatus,
      Semester,
      Employee
    ]),
    ConfigModule,
    CreateBookingtDto,
    UpdateBookingDto,
    UpdateManyBookingDto,
    forwardRef(() => SubjectModule),
    forwardRef(() => SemesterModule),
    forwardRef(() => ShiftModule),

  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule {}
