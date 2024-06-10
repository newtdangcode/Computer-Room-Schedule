import { Module, forwardRef } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { ConfigModule } from '@nestjs/config';
import { Shift } from 'src/entities/shift.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'process';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift]),
    ConfigModule,
    forwardRef(() => BookingModule),
  ],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService],
})
export class ShiftModule {}
