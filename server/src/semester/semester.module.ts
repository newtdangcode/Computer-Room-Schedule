import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from 'src/entities/semester.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateSemesterDto } from 'src/dto/semester/create-semester.dto';
import { UpdateSemesterDto } from 'src/dto/semester/update-semester.dto';
import { UpdateManySemesterDto } from 'src/dto/semester/update-many-semester.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Semester]),
    ConfigModule,
    CreateSemesterDto,
    UpdateSemesterDto,
    UpdateManySemesterDto
  ],
  controllers: [SemesterController],
  providers: [SemesterService],
  exports: [SemesterService],
})
export class SemesterModule {}
