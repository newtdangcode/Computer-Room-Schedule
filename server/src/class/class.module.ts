import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/entities/class.entity';
import { config } from 'process';
import { ConfigModule } from '@nestjs/config';
import { CreateClassDto } from 'src/dto/class/create-class.dto';
import { UpdateClassDto } from 'src/dto/class/update-class.dto';
import { UpdateManyClassDto } from 'src/dto/class/update-many-class.dto';
import { Lecturer } from 'src/entities/lecturer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Lecturer]),
    ConfigModule, 
    CreateClassDto,
    UpdateClassDto,
    UpdateManyClassDto,
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
