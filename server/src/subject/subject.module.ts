import { Module, forwardRef } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'src/entities/subject.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateStudentDto } from 'src/dto/student/create-student.dto';
import { UpdateStudentDto } from 'src/dto/student/update-student.dto';
import { UpdateManyStudentDto } from 'src/dto/student/update-many-employee.dto';
import { Student } from 'src/entities/student.entity';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, Student]),
    ConfigModule,
    CreateStudentDto,
    UpdateStudentDto,
    UpdateManyStudentDto,
    forwardRef(() => StudentModule),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
