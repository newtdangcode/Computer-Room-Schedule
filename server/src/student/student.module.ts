import { Module, forwardRef } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { Account } from 'src/entities/account.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateStudentDto } from 'src/dto/student/create-student.dto';
import { UpdateStudentDto } from 'src/dto/student/update-student.dto';
import { AuthModule } from 'src/auth/auth.module';
import { UpdateManyStudentDto } from 'src/dto/student/update-many-employee.dto';
import { Subject } from 'rxjs';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Student, Subject]),
    ConfigModule,
    CreateStudentDto,
    UpdateStudentDto,
    UpdateManyStudentDto,
    forwardRef(() => AuthModule),
    forwardRef(() => SubjectModule),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
